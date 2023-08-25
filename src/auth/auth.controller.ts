/* eslint-disable prettier/prettier */
import { Body, Controller, Res, Post, UseGuards, HttpCode } from '@nestjs/common';
import AuthService from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import {Response} from "express"
import { JwtGuard } from './guards/jwt.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    
    @Post("signup")
    async signup(@Body() dto: SignUpDto, @Res() res: Response){
       
        let data = await this.authService.signup(dto)
        res.status(data.statusCode).json(data)
    } 

    @Post("signin")
    async signin(@Body() dto: SignInDto, @Res({passthrough: true}) res: Response){
        let data = await this.authService.signin(dto)

        res.cookie("access_token", data.data, {httpOnly: true})
        res.status(data.statusCode).json(data)
    }

    @HttpCode(200)
    @UseGuards(JwtGuard)
    @Post("logout")
    logout(@Res({passthrough: true}) res: Response){
        
        res.cookie("access_token", null, {httpOnly: true})
        return this.authService.logout()

    }
}
