import {
    Controller,
    Request,
    Post,
    UseGuards,
    Res,
    Req,
    Body,
    ValidationPipe,
    HttpCode,
    NotFoundException
} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "../service/auth.service";
import { Response } from 'express';
import {AuthInputDto, ConfirmationInputDto, EmailDto, NewPasswordDto} from "./models/auth-input.dto";
import {DeviceService} from "../../device/service/device.service";
@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private deviceService: DeviceService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
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


        const { accessToken, refreshToken } = await this.authService.login(user)

        await this.deviceService.createDevice(refreshToken, ip, title2)
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.send({ accessToken });

    }

    @HttpCode(204)
    @Post('/registration')
    async registration (@Body(new ValidationPipe()) authInputDto: AuthInputDto) {

        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email
        })
    }

    @HttpCode(204)
    @Post('/registration-confirmation')
    async registrationConfirmation (@Body(new ValidationPipe()) confirmationInputDto: ConfirmationInputDto) {
        const confirm= await this.authService.registrationConfirmation(confirmationInputDto.code)

        if (!confirm) {
            throw new NotFoundException('Account was not confirmed')
        }

    }

    @HttpCode(204)
    @Post('/registration-email-resending')
    async emailResending (@Body(new ValidationPipe()) emailResendingDto: EmailDto) {
        const result = await this.authService.resendEmail(emailResendingDto.email)

        if (!result) {
            throw new NotFoundException('Email was not sent')
        }

    }

    @Post('/password-recovery')
    async passwordRecovery (@Body(new ValidationPipe()) newPasswordDto: NewPasswordDto) {
        const result = await this.authService.newPassword(newPasswordDto.recoveryCode, newPasswordDto.newPassword)

        if(!result) {
            throw new NotFoundException('Password was not changed')
        }
    }

    @HttpCode(204)
    @Post('/new-password')
    async newPassword (@Body(new ValidationPipe()) passwordRecoveryDto: EmailDto) {
        const result = await this.authService.recoveryPassword(passwordRecoveryDto.email)

        if(!result) {
            throw new NotFoundException('Password was not changed')
        }
    }




}