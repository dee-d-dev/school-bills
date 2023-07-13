import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { StudentController } from './student/student.controller';
import { BillModule } from './bills/bill.module';


@Module({
  imports: [AuthModule, PrismaModule, BillModule,ConfigModule.forRoot({isGlobal: true})],
  controllers: [StudentController],
})
export class AppModule {}
