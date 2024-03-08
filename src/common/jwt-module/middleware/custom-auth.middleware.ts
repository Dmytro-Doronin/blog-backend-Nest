import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import {CustomJwtService} from "../service/jwt.service";

@Injectable()
export class CustomAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: CustomJwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtService.getUserIdByToken(token);
            req.userId = userId || '';
        } else {
            req.userId = '';
        }

        next();
    }
}