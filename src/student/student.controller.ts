import { Controller, Get, UseGuards, Req, Res, HttpCode, Injectable } from '@nestjs/common';
import { JwtUser } from 'src/auth/decorators/jwt-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { StudentService } from './student.service';
import { Response } from 'express';


@Controller('profile')
@Injectable()
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my-bills')
  async getMyBills(@Res() res: Response, @JwtUser() user: any) {
    let response = await this.studentService.getMyBills(user)
    res.status(200).json(response);
    // return this.studentService.getMyBills(user);
  }

  @UseGuards(JwtGuard)
  @Get('transactions')
  async getMyTransactions(@Res() res: Response, @JwtUser() user: any) {
    res.json(await this.studentService.getMyTransactions(user));
  }

  @UseGuards(JwtGuard)
  @Get('transactions/department')
  async getMyTransactionsByDepartment(@Res() res: Response, @JwtUser() user: any) {
    res.json(await this.studentService.getMyTransactionsByDepartment(user));
  }

  @UseGuards(JwtGuard)
  @Get('transactions/faculty')
  async getMyTransactionsByFaculty(@Res() res: Response, @JwtUser() user: any) {
    res.json(await this.studentService.getMyTransactionsByFaculty(user));
  }

  @UseGuards(JwtGuard)
  @Get('unpaid-bills')
  async getUnpaidBills(@Res() res: Response,  @JwtUser() user: any){
    let response = await this.studentService.getUnpaidBills(user)
    console.log(user)
    res.status(response.statusCode).json(response);
  }

  @UseGuards(JwtGuard)
  @Get('paid-bills')
  async getPaidBills(@Res() res: Response,  @JwtUser() user: any){
    let response = await this.studentService.getPaidBills(user)
    res.status(response.statusCode).json(response);
  }



}
