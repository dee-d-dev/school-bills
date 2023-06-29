/* eslint-disable prettier/prettier */
import { Body, Controller } from '@nestjs/common';
import AuthService from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post("/signup")
    signup(@Body() dto: SignUpDto){
        
        
        return this.authService.signup(dto)
    } 

    @Post("/signin")
    signin(@Body() dto: SignInDto){
        return this.authService.signin(dto)
    }

    logout(){
        return this.authService.logout()

    }
}
