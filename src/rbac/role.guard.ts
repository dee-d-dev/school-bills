import Role from './role.enum'
import { CanActivate, ExecutionContext, Injectable,mixin, Type } from '@nestjs/common'
import { JwtGuard } from 'src/auth/guards/jwt.guard'

const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            const { user } = context.switchToHttp().getRequest()
            return user.role === role
        }
    }

    return mixin(RoleGuardMixin)
}

export default RoleGuard