/* eslint-disable prettier/prettier */
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto, SignInDto, ChangePassword } from './dto';
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
        throw new ForbiddenException("A user with this matric-number/Email already exists")
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

      let token: string;
      if(user.role == 'admin'){
        token = await this.signToken(user.id, user.email, user.role)

      }else {
        token = await this.signToken(user.id, user.matric_no, user.role)
      }

  
      return {
        data:{
          token,
          user
        },
        message: `${user.role} created successfully`,
        statusCode: 201
      };
    } catch (error) {
      
      throw new ForbiddenException(error.message).getResponse()
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
        return {
          message: "Incorrect login details",
          statusCode: 400
        }
      }
  
      const checkedPassword = await argon.verify(user.password, password)

      delete user.password
  
      if(!checkedPassword){
        return {
          message: "Incorrect login details",
          statusCode: 400
        }
      }

      if(user.role == "admin"){
        const access_token = await this.signToken(user.id, user.email, user.role)
        return {
          data: {
            token:access_token,
            user: user,
          },
          message: "Logged in successfully",
          statusCode: 200
        }
      }else{
        const access_token = await this.signToken(user.id, user.matric_no, user.role)
        return {
          data: access_token,
          user: user,
          message: "Logged in successfully",
          statusCode: 200
        }
      }

    } catch (error: any) {
      return {
        message: error.message,
        statusCode: 400
      }
    }
  }

  async changePassword(dto: ChangePassword){
    const {password, confirmPassword} = dto

    if(password != confirmPassword) {
      throw new Error("Passwords do not match")
    }

    // await this.prisma.user.update({
    //   where:{
    //     id: 
    //   },
    //   data: {
    //     password
    //   }
    // })
  }

  logout() {
    return {
      message: "Logged out successfully",
      statusCode: 200
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
