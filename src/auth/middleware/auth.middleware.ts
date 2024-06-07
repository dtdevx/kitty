import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    if (accessToken) {
      req.headers['authorization'] = `Bearer ${accessToken}`;
    }
    next();
  }
}
