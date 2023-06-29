import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {

  @IsNotEmpty()
  @IsString()
  matric_no: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  last_name: string

  @IsString()
  @IsNotEmpty()
  faculty: string

  @IsString()
  @IsNotEmpty()
  department: string

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto{
  @IsString()
  matric_no: string;

  @IsNotEmpty()
  password: string;
}