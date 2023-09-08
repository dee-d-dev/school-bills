import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
class HealthCheck{
    constructor(){

    }

    @Get("health")
    async healthCheck(@Res() res: Response){
        res.status(200).json({status:"API IS ALIVE"})
    }
}

export default HealthCheck