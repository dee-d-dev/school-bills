/* eslint-disable prettier/prettier */
import { Body, Controller, Res, Post, UseGuards, HttpCode } from '@nestjs/common';
import AuthService from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import {Response} from "express"
import { JwtGuard } from './guards/jwt.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @HttpCode(201)
    @Post("signup")
    signup(@Body() dto: SignUpDto){
        return this.authService.signup(dto)
    } 

    @HttpCode(200)
    @Post("signin")
    async signin(@Body() dto: SignInDto, @Res({passthrough: true}) res: Response){
        let token = await this.authService.signin(dto)

        res.cookie("access_token", token, {httpOnly: true})
        return {token}
    }

    @HttpCode(200)
    @UseGuards(JwtGuard)
    @Post("logout")
    logout(@Res({passthrough: true}) res: Response){
        
        res.cookie("access_token", null, {httpOnly: true})
        return this.authService.logout()

    }
}
