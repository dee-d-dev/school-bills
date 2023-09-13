import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('TokenMiddleware is executing');
    const token = req.headers.authorization; // Assuming the token is stored in the 'Authorization' header

    if (token) {
      req['access_token'] = token; // Attach the token to the request object
    }

    next();
  }
}
