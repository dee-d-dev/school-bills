/* eslint-disable prettier/prettier */
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import * as argon from "argon2"
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export default class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}

  async signup(dto: SignUpDto) {

    try {
      const {password, matric_no, first_name, last_name, email, faculty, department} = dto

      //set role
      //if it has matric_no it is a student, if it doesnt it is an admin
      const role = matric_no? "student": "admin";

      if(role == "admin"){
        if(faculty && department){
          throw new ForbiddenException("You cannot be an admin for a faculty and department, It can only be either a faculty or a department")
        }

        if(department){

          const departmentAdminCount = await this.prisma.user.count({
            where: {
              role: 'admin',
              department: department
            }
          })
  
          if(departmentAdminCount >= 2){
            throw new ForbiddenException("Maximum number of admins for this department has been reached")
            
          }
        }
  
        if(faculty){
          const facultyAdminCount = await this.prisma.user.count({
            where: {
              role: 'admin',
              faculty: faculty
            }
          })
  
          if(facultyAdminCount >= 2) {
            throw new ForbiddenException("Maximum number of admins for this faculty has been reached")
            
          }
        }
      }

      if(role == "student"){
        if(!faculty){
          throw new ForbiddenException("A student must have a faculty and department")
        }
        if(!department){
          throw new ForbiddenException("A student must have a faculty and department")
        }
      }

      //generate password hash
      const hashedPassword = await argon.hash(password)

      let userExists = await this.prisma.user.findFirst({
        where: {  
          OR: [
            {matric_no},
            {email}
          ]
        }
      })

      if(userExists){
        return new ForbiddenException("A user with this matric-number/Email already exists")
      }


      
      

      //save user to db
      const user = await this.prisma.user.create({
        data: {
          matric_no,
          first_name,
          last_name,
          faculty,
          department,
          email,
          role,
          password: hashedPassword
  
        }
      })


  
      delete user.password
  
      return user;
    } catch (error) {
      
      return new ForbiddenException(error.message).getResponse()
    }
  }

  async signin(dto: SignInDto) {
    try {
      const {matric_no, email, password} = dto
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
           { matric_no},
           {email}
          ]
        }
      })
  
      if(!user) {
        return new ForbiddenException("Incorrect login details")
      }
  
      const checkedPassword = await argon.verify(user.password, password)
  
      if(!checkedPassword){
        return new ForbiddenException("Incorrect login details")
      }

      if(user.role == "admin"){
        const access_token = await this.signToken(user.id, user.email, user.role)
        return access_token
      }else{
        const access_token = await this.signToken(user.id, user.matric_no, user.role)
        return access_token
      }

    } catch (error: any) {
      return error.message
    }
  }

  logout() {
    return {
      message: "Successfully logged out"
    };
  }

  signToken(userId: string, identity: string, role: string): Promise<string>{
    const payload = {
      sub: userId,
      identity,
      role
    }


    const secret = this.config.get('JWT_SECRET')

    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret
    })
  }
}
