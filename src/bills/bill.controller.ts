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
        
        const bill = await this.billService.createBill(dto, user.identity)

        res.status(201).json(bill)
    }

    @Put("edit/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async editBill(@Body() dto: EditBillDto, @Param("id") id: string, @JwtUser() user: any){
        return this.billService.editBill(dto, id, user.identity)
    }

    @Delete("delete/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async deleteBill(@Param("id", ParseIntPipe) id: string,@JwtUser() user: any){
        return this.billService.deleteBill(id, user.identity)
    }

    @Get("all")
    @UseGuards(JwtGuard)
    async getBills(@JwtUser() user: any){
        return this.billService.getBills(user.identity)
    }

    @Post("pay/:id")
    @UseGuards(JwtGuard)
    async payBill(@Param("id") id: string, @JwtUser() user: any, @Res() res: Response){

        const {sub} = user
        const response = await this.billService.payBills(id, sub) 

        res.status(response.statusCode).json(response.data)
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
            throw error.message
        }
        
    }
    
}

export default BillController