import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';



@Controller('students')
export class StudentController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(){
    return "user info"
  }

}
