import { Get, Injectable } from '@nestjs/common';
import BillService from 'src/bills/bill.service';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class StudentService {

    constructor(private prisma: PrismaService, private billService: BillService) {}

   
    getMyBills = async(user: any) => {
        const student = await this.prisma.user.findFirst({
            where:{
                matric_no: user.identity
            }
        })

        
        if(!student){
            throw new Error("this student does not exist")
        }

        // console.log(student)

        if(student.faculty && student.department){
            let my_bills = await this.prisma.bill.findMany({
                where: {
                    OR: [
                        {faculty: student.faculty},
                        {department: student.department}

                    ]       
                }
            })

            if(my_bills.length <= 0){
                return {
                    data: my_bills,
                    message: "You do not have any bill currently",
                    statusCode: 200
                }
            }

            for(const bill of my_bills){
                const hasPaid = await this.billService.userHasPaidBill(bill.id, student.id)
                bill.hasPaid = hasPaid
            }

            return {
                data: my_bills,
                message: "Bills fetched successfully",
                statusCode: 200
            }
        }
 

    }

    getUnpaidBills = async (user: any) => {
        const student = await this.prisma.user.findFirst({
            where:{
                matric_no: user.identity
            }
        })

        if(!student){
            throw new Error("this student does not exist")
        }

        if(student.faculty && student.department){
            let my_bills = await this.prisma.bill.findMany({
                where: {
                    OR: [
                        {faculty: student.faculty},
                        {department: student.department}

                    ],
                    hasPaid: false       
                }
            })

            if(my_bills.length <= 0){
                return {
                    data: [],
                    message: "You do not have any bill currently",
                    statusCode: 200

                }
            }

            for(const bill of my_bills){
                const billStatus = await this.billService.userHasPaidBill(bill.id, student.id)
                bill.hasPaid = billStatus
            }

            const my_unpaid_bills = my_bills.filter((bill) => {
                if(bill.hasPaid == false){
                    return bill
                }
            })

            return {
                data: my_unpaid_bills,
                message: "Unpaid Bills fetched successfully",
                statusCode: 200
            }
        }
        
    }

    getPaidBills = async (user: any) => {
        try {
            
            const student = await this.prisma.user.findFirst({
                where:{
                    matric_no: user.identity
                }
            })
    
            if(!student){
                throw new Error("this student does not exist")
            }
    
    
            if(student.faculty && student.department){
                let my_bills = await this.prisma.bill.findMany({
                    where: {
                        OR: [
                            {faculty: student.faculty},
                            {department: student.department}
    
                        ]     
                    }
                })
    
                if(my_bills.length <= 0){
                    return {
                        data: [],
                        statusCode: 200,
                        message: "You do not have any bill currently"
                    }
                }
    
                for(const bill of my_bills){
                    const billStatus = await this.billService.userHasPaidBill(bill.id, student.id)
                    bill.hasPaid = billStatus
                }
    
                const my_paid_bills = my_bills.filter((bill) => {
                    if(bill.hasPaid == true){
                        return bill
                    }
                })
    
                return {
                    data: my_paid_bills,
                    message: "Paid Bills fetched successfully",
                    statusCode: 200
                }
            }
        } catch (error) {
            throw new error.message
        }
        
    }

    async getMyTransactions(user: any) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                matric_no: user.identity
            },
            orderBy: {
                created_at: 'desc'
            },
        })

        if(transactions.length <= 0){
            return {
                data:[],
                message: "You do not have any transaction currently",
                statusCode: 200
            }
        }

        return {
            data:transactions,
            message: "Successfully fetched transactions",
            statusCode: 200
        }
    }

    async getMyTransactionsByDepartment(user: any) {
        const userDept = await this.prisma.user.findUnique({
            where: {
                matric_no: user.identity
            }
        })
        const transactions = await this.prisma.transaction.findMany({
            where: {
                matric_no: user.identity,
                department: userDept.department
            },
            orderBy: {
                created_at: 'desc'
            },
        })

        if(transactions.length <= 0){
            return {
                data:[],
                message: "You do not have any department transaction currently",
                statusCode: 200
            }
        }

        return {
            data:transactions,
            message: "Successfully fetched department transactions",
            statusCode: 200
        }
    }

    async getMyTransactionsByFaculty(user: any) {
        const userFaculty = await this.prisma.user.findUnique({
            where: {
                matric_no: user.identity
            }
        })
        const transactions = await this.prisma.transaction.findMany({
            where: {
                matric_no: user.identity,
                faculty: userFaculty.faculty
            },
            orderBy: {
                created_at: 'desc'
            },
        })

        if(transactions.length <= 0){
            return {
                data:[],
                message: "You do not have any faculty transaction currently",
                statusCode: 200
            }
        }

        return {
            data:transactions,
            message: "Successfully fetched department transactions",
            statusCode: 200
        }
    }
}
