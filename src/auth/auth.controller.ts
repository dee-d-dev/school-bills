/* eslint-disable prettier/prettier */
import { Body, Controller, Res, Req, Post, UseGuards, HttpCode } from '@nestjs/common';
import AuthService from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import {Request, Response} from "express"
import { JwtGuard } from './guards/jwt.guard';
import { JwtUser } from './decorators/jwt-user.decorator';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    
    @Post("signup")
    async signup(@Body() dto: SignUpDto, @Res() res: Response, @Req() req: Request){
        try {
            let data = await this.authService.signup(dto)

            // res.cookie("access_token", data.data.token, {httpOnly: true})
            req.headers.authorization = `Bearer ${data.data.token}`;

            res.status(data.statusCode).json(data)
            
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    } 

    @Post("signin")
    async signin(@Body() dto: SignInDto, @Res() res: Response, @Req() req: Request){
        try {
            
            let data = await this.authService.signin(dto)
    
            req.headers.authorization = `Bearer ${data.data.token}`;
            // console.log(req)
            res.status(data.statusCode).json(data)
        } catch (error) {
            // res.json({
            //     message: error.message,
            //     statusCode: 400
            // })

            throw new Error(error.message)
        }
    }

    @HttpCode(200)
    @UseGuards(JwtGuard)
    @Post("logout")
    logout(@Res({passthrough: true}) res: Response, @Req() req: Request){
        try {
            
            req.headers.authorization = null
            return this.authService.logout()
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }

    }

    @HttpCode(200)
    @UseGuards(JwtGuard)
    @Post("change-password")
    changePassword(@Res({passthrough: true}) res: Response, @JwtUser() user: any, @Req() req: Request){
        try {
            const {password, confirmPassword} = req.body
            console.log(req)
            return this.authService.changePassword({password, confirmPassword})
            
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }

    }
}
