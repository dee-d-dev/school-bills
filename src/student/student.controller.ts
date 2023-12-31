import { Controller, Get, UseGuards, Req, Res, HttpCode, Injectable } from '@nestjs/common';
import { JwtUser } from 'src/auth/decorators/jwt-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { StudentService } from './student.service';
import { Response } from 'express';
import RoleGuard from 'src/rbac/role.guard';
import Role from 'src/rbac/role.enum';


@Controller('profile')
@Injectable()
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my-bills')
  async getMyBills(@Res() res: Response, @JwtUser() user: any) {
    try {
            
      let response = await this.studentService.getMyBills(user)
      res.status(200).json(response);
      // return this.studentService.getMyBills(user);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @UseGuards(JwtGuard)
  @Get('transactions')
  async getMyTransactions(@Res() res: Response, @JwtUser() user: any) {
    try {
            
      res.json(await this.studentService.getMyTransactions(user));
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @UseGuards(JwtGuard)
  @Get('transactions/department')
  async getMyTransactionsByDepartment(@Res() res: Response, @JwtUser() user: any) {
    try {
            
      res.json(await this.studentService.getMyTransactionsByDepartment(user));
    } catch (error) {
        throw new Error(error.message)
    }
  }

  @UseGuards(JwtGuard)
  @Get('transactions/faculty')
  async getMyTransactionsByFaculty(@Res() res: Response, @JwtUser() user: any) {
    try {
            
      res.json(await this.studentService.getMyTransactionsByFaculty(user));
    } catch (error) {
        throw new Error(error.message)
    }
  }

  @UseGuards(RoleGuard(Role.STUDENT))
  @UseGuards(JwtGuard)
  @Get('unpaid-bills')
  async getUnpaidBills(@Res() res: Response,  @JwtUser() user: any){
    try {
            
      let response = await this.studentService.getUnpaidBills(user)
      // console.log(user)
      res.status(response.statusCode).json(response);
    } catch (error) {
     res.json(error.message)
    }
  }

  @UseGuards(JwtGuard)
  @Get('paid-bills')
  async getPaidBills(@Res() res: Response,  @JwtUser() user: any){
    try {
            
      let response = await this.studentService.getPaidBills(user)
      res.status(response.statusCode).json(response);
    } catch (error) {
        throw new Error(error.message)
    }
  }



}
