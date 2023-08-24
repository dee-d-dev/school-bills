// jwt-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtPayload } from './jwt-payload.interface';

export const JwtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Assuming the user object is attached to the request

    return user;
  },
);
