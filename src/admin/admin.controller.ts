import { Controller, UseGuards, HttpCode, Get, Res } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtUser } from 'src/auth/decorators/jwt-user.decorator';
import RoleGuard from 'src/rbac/role.guard';
import Role from 'src/rbac/role.enum';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @UseGuards(RoleGuard(Role.ADMIN))
    @UseGuards(JwtGuard)
    @HttpCode(200)
    @Get('transactions')
    async getAllTransactions(@Res() res: Response, @JwtUser() user: any) {
        const transactions = await this.adminService.getAllTransactions(user)
        res.json(transactions);
    }
}
