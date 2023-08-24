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

    res.status(200).json(await this.studentService.getMyBills(user));
    // return this.studentService.getMyBills(user);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('transactions')
  async getMyTransactions(@Res() res: Response, @JwtUser() user: any) {
    res.json(await this.studentService.getMyTransactions(user));
  }

}
