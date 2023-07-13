import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Post,
    Put,
    Param, 
    Get,
    ParseIntPipe,
    UseGuards, 
    UseInterceptors,
    Injectable,
    Body
} from "@nestjs/common"
import BillService from "./bill.service"
import RoleGuard from "../rbac/role.guard"
import Role from "../rbac/role.enum"
import { JwtGuard } from "src/auth/guards/jwt.guard"
import { CreateBillDto, EditBillDto } from "./dto"
import { JwtUser } from "src/auth/decorators/jwt-user.decorator"

@Controller("bills")
@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
class BillController {
    constructor(private billService: BillService){}

    @Post("create")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async createBill(@Body() dto: CreateBillDto, @JwtUser() user: any){
        
        return this.billService.createBill(dto, user.identity)
    }

    @Put("edit/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async editBill(@Body() dto: EditBillDto, @Param("id", ParseIntPipe) id: number, @JwtUser() user: any){
        return this.billService.editBill(dto, id, user.identity)
    }

    @Delete("delete/:id")
    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    async deleteBill(@Param("id", ParseIntPipe) id: number,@JwtUser() user: any){
        return this.billService.deleteBill(id, user.identity)
    }

    @Get("all")
    @UseGuards(JwtGuard)
    async getBills(@JwtUser() user: any){
        return this.billService.getBills(user.identity)
    }
    
}

export default BillController