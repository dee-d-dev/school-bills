import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { StudentController } from './student/student.controller';
import { BillModule } from './bills/bill.module';
import { StudentService } from './student/student.service';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { ArticleModule } from './articles/article.module';
import { HealthCheckModule } from './health/healthCheck.module';

import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [AuthModule, PrismaModule, BillModule,ConfigModule.forRoot({isGlobal: true}), StudentModule, AdminModule, ArticleModule, HealthCheckModule],
  controllers: [],
  providers: [ 
  
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply the middleware to all routes
  }
}
