import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { StudentController } from './student/student.controller';
import { BillModule } from './bills/bill.module';
import { StudentService } from './student/student.service';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [AuthModule, PrismaModule, BillModule,ConfigModule.forRoot({isGlobal: true}), StudentModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
