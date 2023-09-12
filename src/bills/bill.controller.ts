import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Post,
    Put,
    Param, 
    Res,
    Req,
    Get,
    ParseIntPipe,
    UseGuards, 
    UseInterceptors,
    Injectable,
    Body,
    HttpCode
} from "@nestjs/common"
import BillService from "./bill.service"
import RoleGuard from "../rbac/role.guard"
import Role from "../rbac/role.enum"
import { JwtGuard } from "src/auth/guards/jwt.guard"
import { CreateBillDto, EditBillDto } from "./dto"
import { JwtUser } from "src/auth/decorators/jwt-user.decorator"
import { Response, Request } from "express"


@Controller("bills")
@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
class BillController {
    constructor(private billService: BillService){}

    @Post("create")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async createBill(@Body() dto: CreateBillDto, @JwtUser() user: any, @Res() res: Response){
        try {
            
            
            const bill = await this.billService.createBill(dto, user.identity)
    
            res.status(201).json({
                data: bill,
                message: "Bill created successfully",
                statusCode: 201
            })
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    }

    @Put("edit/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async editBill(@Body() dto: EditBillDto, @Param("id") id: string, @JwtUser() user: any, @Res() res: Response){
        try {
            
            const bill = await this.billService.editBill(dto, id, user.identity)
    
            res.status(200).json({
                data: bill,
                message: "Bill updated successfully",
                statusCode: 200
            })
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    }

    @Delete("delete/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async deleteBill(@Param("id") id: string,@JwtUser() user: any, @Res() res: Response){
        try {
            
            const data = await this.billService.deleteBill(id, user.identity)
    
            res.status(200).json({
                data: data,
                message: "Bill deleted successfully",
                statusCode: 200
            })
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    }

    @Get("all")
    @UseGuards(JwtGuard)
    async getBills(@JwtUser() user: any, @Res() res: Response){
        try {
            
            const bills = await this.billService.getBills(user.identity)
    
            res.status(200).json({
                data: bills,
                message: "All bills fetched successfully",
                statusCode: 200
            })
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    }

    @Post("pay/:id")
    @UseGuards(JwtGuard)
    async payBill(@Param("id") id: string, @JwtUser() user: any, @Res() res: Response){
        try {
            
            const {sub} = user
            const response = await this.billService.payBills(id, sub) 
    
            res.status(200).json(
                { 
                    data: response,
                    message: "bill paid successfully",
                    statusCode: 200
                }
            )
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }

    }

    @Get("verify/:reference")
    @UseGuards(JwtGuard)
    async verifyPayment(@Param("reference") reference: string){
        return this.billService.verifyPayment(reference)
    }

    @Post("paystack/webhook")
    async webhook(@Body() body: any, @Req() req: Request, @Res() res: Response){
        
        try {
            // let event = this.billService.webhook(body)
            
            const event = req.body;
            let signature = req.headers['x-paystack-signature']

           const response = await this.billService.handlePaystackWebhook(event, signature)

        //    console.log(response)
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
        
    }
    
}

export default BillController