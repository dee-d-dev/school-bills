import Role from './role.enum'
import { CanActivate, ExecutionContext, Injectable,mixin, Type } from '@nestjs/common'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Response } from 'express'

const RoleGuard = (role: Role): Type<CanActivate> => {
    try {
        
        class RoleGuardMixin implements CanActivate {
            canActivate(context: ExecutionContext) {
                const { user } = context.switchToHttp().getRequest()
                if(user.role != role){
                     throw new Error("You are not authorized to perform this action")
                    
                } 
                return user.role === role
            }
        }
    
        return mixin(RoleGuardMixin)
    } catch (error) {
        throw new Error(error.message)
    }
}

export default RoleGuard