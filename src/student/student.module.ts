import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import BillService from 'src/bills/bill.service';
import Paystack from 'src/utils/paystack';

@Module({
    controllers: [StudentController],
    providers: [StudentService, BillService, Paystack],
})
export class StudentModule {}
