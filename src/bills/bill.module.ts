import { Module, Global } from '@nestjs/common';
import BillService from './bill.service';
import BillController from './bill.controller';
import Paystack from 'src/utils/paystack';


@Module({
    providers: [BillService, Paystack],
    controllers: [BillController],
})
export class BillModule {}
