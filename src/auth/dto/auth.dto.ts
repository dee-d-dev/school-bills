// import { Role } from "@prisma/client";
import Role from "src/rbac/role.enum";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {Transform} from 'class-transformer'

export class SignUpDto {

  @IsOptional()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  matric_no?: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({value}) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({value}) => value.toLowerCase())
  first_name: string

  @IsString()
  @IsNotEmpty()
  @Transform(({value}) => value.toLowerCase())
  last_name: string

  // @IsOptional()
  // @IsEnum(Role)
  // role?: Role = Role.STUDENT

 @IsOptional()
 @IsString()
 @Transform(({value}) => value.toLowerCase())
  faculty?: string

 @IsOptional()
 @IsString()
 @Transform(({value}) => value.toLowerCase())
  department?: string

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto{
  @IsOptional()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  matric_no: string;

  @IsOptional()
  @IsEmail()
  @Transform(({value}) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;
}