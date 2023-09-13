import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBillDto, EditBillDto } from './dto';
import { PrismaService } from 'src/database/prisma.service';
import Paystack from 'src/utils/paystack';
import { paymentDTO } from './dto/payment.dto';
import {createHmac} from 'crypto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export default class BillService {
    constructor(private prisma: PrismaService, private paystack: Paystack, private config: ConfigService){}


    public createBill = async (dto: CreateBillDto, admin_id: string) => {
        try {
            const {faculty, department} = dto
            // const {faculty, department} = data
            
            const admin = await this.prisma.user.findUnique({
                where:{
                    email: admin_id,
                },
                select: {   
                    department: true,
                    faculty: true,
                }
            })

            if(faculty){
                if(admin.faculty != faculty){
                    throw new Error("You are not allowed to create a bill for this faculty, You are not an admin in this faculty")
                }
                
            }

            if(department){
                if(admin.department != department){
                    throw new Error("You are not allowed to create a bill for this department, You are not an admin in this department")
                }

            }

            // const transaction = await this.paystack.initializeTransaction({
            //     amount: dto.amount * 100,
            //     email: "dummy@gmail.com",    
            // })


            const bill = await this.prisma.bill.create({
                data: {
                    ...dto,
                    admin_id
                }
            })

            return {
                data:[bill],
                message: "Bill created successfully"
            }
            // const {data} = transaction
            // return data.authorization_url

            
        } catch (error: any) {
            throw new ForbiddenException(error.message)
        }
        // return dto
    }

    editBill = async (dto: EditBillDto, id: string, admin_id: string,) => {
        try{
            // const {amount, title, account_no, bank_name, faculty, department} = dto
            const admin = await this.prisma.user.findUnique({
                where:{
                    email: admin_id,
                },
                select: {   
                    department: true,
                    faculty: true,
                }
            })
    
            const {faculty, department} = await this.prisma.bill.findUnique({
                where: {
                    id
                }
            })
    
            if(faculty){
                if(admin.faculty != faculty){
                    throw new Error("You are not allowed to Edit a bill for this faculty, You are not an admin in this faculty")
                }
                
            }
    
            if(department){
                if(admin.department != department){
                    throw new Error("You are not allowed to Edit a bill for this department, You are not an admin in this department")
                }
            }
            
            return this.prisma.bill.update({
                where: {
                    id
                },
                data: {
                    ...dto
                }
            })

        }catch(error){
            return new ForbiddenException(error.message).getResponse()
        }
    }

    deleteBill = async (id: string, admin_id: string) => {
        try {
          
            const admin = await this.prisma.user.findUnique({
                where:{
                    email: admin_id,
                },
                select: {   
                    department: true,
                    faculty: true,
                }
            })

            let bill = await this.prisma.bill.findUnique({
                where:{
                    id
                }
            })

            if(!bill){
                throw new Error("Bill with this id does not exist")
            }
    
            const {faculty, department} = bill
    
            if(faculty){
                if(admin.faculty != faculty){
                    throw new Error("You are not allowed to delete a bill for this faculty, You are not an admin in this faculty")
                }
                
            }
    
            if(department){
                if(admin.department != department){
                    throw new Error("You are not allowed to delete a bill for this department, You are not an admin in this department")
                }
            }
          

            await this.prisma.bill.delete({
                where: {
                    id
                }
            })

            return "Bill Successfully deleted"
    
        } catch (error) {
            return new ForbiddenException(error.message).getResponse()
        }
    }

    getBills = async (user_id: string) => {
        try {
            
            const user = await this.prisma.user.findFirst({
                where:{
                    OR: [
                        {email: user_id},
                        {matric_no: user_id}
                    ]
                },
                select: {   
                    department: true,
                    faculty: true,
                }
            })

            if(!user){
                throw new Error("Can't get bills for this user")
            }
    
            if(user.faculty && user.department){
                let bills = await this.prisma.bill.findMany({
                    where: {
                        OR: [
                            {faculty: user.faculty},
                            {department: user.department}
    
                        ]       
                    }
                })

                if(bills.length <= 0){
                    return {
                        data: [],
                        message: "No bill created for your faculty and department yet",
                        statusCode: 200
                    }
                }

                return bills
            }
     
    
            if(user.faculty){
                let bills = await this.prisma.bill.findMany({
                    where: {
                        faculty: user.faculty
                    }
                })
                
                if(bills.length <= 0){
                    return {
                        data: [],
                        message: "No bill created for this faculty yet",
                        statusCode: 200
                    }
                }

                return bills
            }
    
            if(user.department){
                let bills = await this.prisma.bill.findMany({
                    where: {
                        department: user.department
                    }, 
                })

                if(bills.length <= 0){

                    return {
                        data: [],
                        message: "No bill created for this department yet",
                        statusCode: 200
                    }
                }

                return bills
            }
    
    
           
        
        } catch (error) {
            throw new ForbiddenException(error.message).getResponse()
        }
    }

    payBills = async (billId: string, userId: string) => {
        try {
            
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if(!user){
                throw new Error("User does not exist")
            }

            const bill = await this.prisma.bill.findUnique({
                where: {
                    id: billId
                }
            })

           

            if(!bill){
                throw new Error("Bill does not exist")
            }

            const userHasPaid = await this.userHasPaidBill(billId, userId)

            if(userHasPaid){
                throw new Error("You have already paid this bill")
            }
            
            const transaction = await this.paystack.initializeTransaction({
                amount: bill.amount * 100,
                email: user.email,
                metadata: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    matric_no: user.matric_no,
                    user_id: user.id,
                    bill_id: bill.id,
                    admin_id: bill.admin_id,
                    title: bill.title,
                    department: bill.department,
                    faculty: bill.faculty,
                }
            })

            const {data} = transaction
            return data
        } catch (error) {
            throw new ForbiddenException(error.message).getResponse()
        }
    }

    verifyPayment = async (reference: string) => {
        try {
            const payment = await this.paystack.verifyTransaction(reference)
            const {data} = payment
            return data
        } catch (error) {
            throw new ForbiddenException(error.message).getResponse()
        }
    }

    handlePaystackWebhook = async (eventData: any, signature: any) => {
        try {
            let secret = this.config.get('PAYSTACK_SECRET_KEY')
    
            const hash = createHmac('sha512', secret).update(JSON.stringify(eventData)).digest('hex');
    
            if (hash == signature ) {
              // Do something with event
                if (eventData && eventData.event === 'charge.success') {
                   await this.prisma.bill.update({
                    where: {
                        id: eventData.data.metadata.bill_id
                    }, data: {
                        hasPaid: true
                    }
                   })
                   
                    const transaction = await this.prisma.transaction.create({
                        data: {
                            amount: eventData.data.amount / 100,
                            title: eventData.data.metadata.title,
                            matric_no: eventData.data.metadata.matric_no,
                            department: eventData.data.metadata.department,
                            faculty: eventData.data.metadata.faculty,
                            user_id: eventData.data.metadata.user_id,
                            bill_id: eventData.data.metadata.bill_id,
                            admin_id: eventData.data.metadata.admin_id,
                            account_no: eventData.data.authorization.last4,
                            bank_name: eventData.data.authorization.bank,
                            reference: eventData.data.reference,
                            status: eventData.data.status,
                            paid_at: eventData.data.paid_at,
                        }

                    })
                    // console.log(eventData)
                    // return `${eventData.data.metadata.first_name} ${eventData.data.metadata.last_name} with matric number ${ eventData.data.metadata.matric_no} has paid Bill with id ${updateBill.id} successfully`
                    return {
                        data:transaction,
                        message: "successful",
                        statusCode: 201
                    }
                    
                }  
            } 
        } catch (error) {
            return new Error(error.message)
        }
    }

    userHasPaidBill = async (bill_id: string, user_id: string) => {
        const userPaid = await this.prisma.transaction.findFirst({
            where: {
                user_id,
                bill_id,
                status: "success",

            }
        })

        if(userPaid){
            return true
        }else {
            return false
        }
    }
}