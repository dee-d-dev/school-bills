import { Module } from '@nestjs/common';
import BillService from 'src/bills/bill.service';
import Paystack from 'src/utils/paystack';
import ArticleController from './article.controlller';
import ArticleService from './article.service';

@Module({
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
