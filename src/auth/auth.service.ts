/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import * as argon from "argon2"
import { PrismaService } from 'src/database/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export default class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}

  async signup(dto: SignUpDto) {

    try {
      
      //generate password hash
      const hashedPassword = await argon.hash(dto.password)
  
      //save user to db
      const user = await this.prisma.user.create({
        data: {
          matric_no: dto.matric_no,
          first_name: dto.first_name,
          last_name: dto.last_name,
          Faculty: dto.faculty,
          Department: dto.department,
          email: dto.email,
          password: hashedPassword
  
        }
      })
  
      delete user.password
  
      return user;
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code == 'P2002'){
          return new ForbiddenException(
            "A user with this matric number already exists"
          )
        }
      }
      return error
    }
  }

  async signin(dto: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
         
          matric_no: dto.matric_no  
        }
      })
  
      if(!user) {
        return new ForbiddenException("Incorrect login details")
      }
  
      const checkedPassword = await argon.verify(user.password, dto.password)
  
      if(!checkedPassword){
        return new ForbiddenException("Incorrect login details")
      }

      const access_token = await this.signToken(user.id, user.matric_no)
      return {access_token}
    } catch (error: any) {
      return error.message
    }
  }

  logout() {
    return { message: 'I logged out' };
  }

  signToken(userId: number, matric_no: string): Promise<string>{
    const payload = {
      sub: userId,
      matric_no
    }

    const secret = this.config.get('JWT_SECRET')

    return this.jwt.signAsync(payload, {
      expiresIn: '20m',
      secret
    })
  }
}
