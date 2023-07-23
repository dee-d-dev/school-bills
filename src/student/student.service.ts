import { Get, Injectable } from '@nestjs/common';
import BillService from 'src/bills/bill.service';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class StudentService {

    constructor(private prisma: PrismaService, private billService: BillService) {}

   
    async getMyBills(user: any) {
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
                return {message: "You do not have any bill currently"}
            }

            for(const bill of my_bills){
                const hasPaid = await this.billService.userHasPaidBill(bill.id, student.id)
                bill.hasPaid = hasPaid
            }

            return my_bills
        }
 

        // if(user.faculty){
        //     let bills = await this.prisma.bill.findMany({
        //         where: {
        //             faculty: user.faculty
        //         }
        //     })
            
        //     if(bills.length <= 0){
        //         return {message: "No bill created for this faculty yet"}
        //     }

        //     return bills
        // }

        // if(user.department){
        //     let bills = await this.prisma.bill.findMany({
        //         where: {
        //             department: user.department
        //         }, 
        //     })

        //     if(bills.length <= 0){
        //         return {message: "No bill created for this department yet"}
        //     }

        //     return bills
        // }

    }
}
