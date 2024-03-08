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
    NotFoundException, Get
} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "../service/auth.service";
import { Response } from 'express';
import {AccessTokenDto, AuthInputDto, ConfirmationInputDto, EmailDto, NewPasswordDto} from "./models/auth-input.dto";
import {DeviceService} from "../../device/service/device.service";
import {VerifyRefreshTokenGuard} from "../../../common/jwt-module/guards/verify-token.guard";
import {UserQueryRepository} from "../../user/repositories/user.query-repository";
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private deviceService: DeviceService,
        private userQueryRepository: UserQueryRepository,
        private customJwtService: CustomJwtService
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


        const { accessToken, refreshToken } = await this.authService.createJWT(user)

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


    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/refresh-token')
    async refreshToken (
        @Request() req,
        @Res() res: Response,
        @Body(new ValidationPipe()) accessTokenDto) {

        const userId = req.userId;
        const deviceId = req.deviceId

        const user = await this.userQueryRepository.getUserById(userId)

        const {refreshToken, accessToken} = await this.customJwtService.createJWT(user, deviceId)

        const result = await this.deviceService.changeDevicesData(refreshToken)

        if (!result) {
            throw new NotFoundException('Device data was not changed')
        }
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.send({ accessToken });
    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/logout')
    async logout (
        @Request() req,
        @Res() res: Response,
    ) {
        const deviceId = req.deviceId

        await this.deviceService.deleteDevice(deviceId)

        res.sendStatus(204)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async me (
        @Request() req,
        @Res() res: Response,
    ) {
        const userId = req.userId
        const user = await this.userQueryRepository.getUserById(userId)

        if (!user) {
            throw new NotFoundException('User was not found')
        }

        res.status(200).send({email: user.email, login: user.login, userId: userId})
    }

}