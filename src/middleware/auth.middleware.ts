import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['access-key'];
    if (!token) throw new UnauthorizedException('Unauthorized access');
    const accessKey = this.configService.get<string>('access_key');
    if (token !== accessKey) throw new UnauthorizedException('Invalid token');
    next();
  }
}
