import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService ) {}

    async getAllTransactions(user: any) {
        const admin = await this.prisma.user.findFirst({
            where: {
                id: user.sub
            }
        }); 

        if(!admin){
            throw new Error("This admin does not exist")
        }

        const bills = await this.prisma.bill.findMany({
            where: {
                admin_id: admin.email
            }
        });

        
        const transactions = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    {department: admin.department},
                    {faculty: admin.faculty}

                ]
            }
            
        }); 

        return transactions
        
        
    }
}
