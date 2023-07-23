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

            return bill
            // const {data} = transaction
            // return data.authorization_url

            
        } catch (error: any) {
            return new ForbiddenException(error.message)
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
                    return {message: "No bill created for your faculty and department yet"}
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
                    return {message: "No bill created for this faculty yet"}
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
                    return {message: "No bill created for this department yet"}
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
            const transaction = await this.paystack.initializeTransaction({
                amount: bill.amount * 100,
                email: user.email,
                metadata: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    matric_no: user.matric_no,
                    bill_id: bill.id
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
                    const transactionId = eventData.data.id
                    return { message: `Transaction ${transactionId} successful` }
                }  
                return eventData
            } 
        } catch (error) {
            return new Error(error.message)
        }
    }
}