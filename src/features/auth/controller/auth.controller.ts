import {Controller, Request, Post, UseGuards, Res, Req} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "../service/auth.service";
import { Response } from 'express';
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}


    @UseGuards(LocalAuthGuard)
    @Post('/auth/login')
    async login(
        @Request() req,
        @Res() res: Response
    ) {
        const ip = req.ip
        const user = req.user
        const title = req.headers['User-Agent']
        let title2

        if (typeof title !== "string" || typeof title !== undefined) {
            title2 = title?.[0]
        } else {
            title2 = title
        }

        const {accessToken, refreshToken } = await this.authService.login(user)
        res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})

        return accessToken
    }
}