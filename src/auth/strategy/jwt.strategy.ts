import { Strategy, ExtractJwt } from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport"
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(config: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.access_token
            }]),
            secretOrKey: config.get("JWT_SECRET")
        })
    }

    validate(payload: any){
        return payload
    }
}


