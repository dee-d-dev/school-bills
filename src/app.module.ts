import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { StudentController } from './student/student.controller';


@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [StudentController],
})
export class AppModule {}
