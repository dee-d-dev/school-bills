import { Module, Global } from '@nestjs/common';
import BillService from './bill.service';
import BillController from './bill.controller';
import Paystack from 'src/utils/paystack';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [ConfigModule],
    providers: [BillService, Paystack],
    controllers: [BillController],
})
export class BillModule {}
