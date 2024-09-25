import {
    Body,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Post,
    Request,
    Res,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "../service/auth.service";
import {Response} from 'express';
import {AuthInputDto, ConfirmationInputDto, EmailDto, NewPasswordDto} from "./models/auth-input.dto";
import {DeviceService} from "../../device/service/device.service";
import {VerifyRefreshTokenGuard} from "../../../common/jwt-module/guards/verify-token.guard";
import {UserQueryRepository} from "../../user/repositories/user.query-repository";
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserRepository} from "../../user/repositories/user.repository";

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private deviceService: DeviceService,
        private userQueryRepository: UserQueryRepository,
        private customJwtService: CustomJwtService,
        protected userRepository: UserRepository,
        private readonly jwtService: CustomJwtService
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
        console.log('refresh token', refreshToken)
        console.log('accessToken token', accessToken)
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });
        res.status(200).send({ accessToken });

    }


    @HttpCode(204)
    @Post('/registration')
    async registration (
        @Body(new ValidationPipe()) authInputDto: AuthInputDto,
    ) {
        console.log(authInputDto.login, authInputDto.password, authInputDto.email)
        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email
        })

    }

    @HttpCode(204)
    @Post('/registration-confirmation')
    async registrationConfirmation (
        // @Request() req,
        // @Res() res: Response,
        @Body(new ValidationPipe()) confirmationInputDto: ConfirmationInputDto
    ) {

        // const user = await this.userRepository.getUserByConfirmationCode(confirmationInputDto.code)
        //
        // if (!user) {
        //     return res.status(400).json({ errorsMessages: [{ message: 'code doesnt exist', field: "code" }] })
        // }
        //
        // if (user.emailConfirmation.isConfirmed) {
        //     return res.status(400).json({ errorsMessages: [{ message: 'Email already confirmed', field: "code" }] })
        // }
        //
        const confirm= await this.authService.registrationConfirmation(confirmationInputDto.code)


        if (!confirm) {
            throw new NotFoundException('Account was not confirmed')
        }

        // return res.sendStatus(204)
    }

    @HttpCode(204)
    @Post('/registration-email-resending')
    async emailResending (
        // @Request() req,
        // @Res() res: Response,
        @Body(new ValidationPipe()) emailResendingDto: EmailDto
    ) {
        // const user = await this.userRepository.findUserByLoginOrEmail(emailResendingDto.email)
        //
        // if (!user) {
        //     return res.status(400).json({ errorsMessages: [{ message: 'Email doesnt exist', field: "email" }] })
        //
        // }
        //
        // if (user.emailConfirmation.isConfirmed) {
        //     return res.status(400).json({ errorsMessages: [{ message: 'Email already confirmed', field: "email" }] })
        // }


        const result = await this.authService.resendEmail(emailResendingDto.email)

        if (!result) {
            throw new NotFoundException('Email was not sent')
        }

        // return res.sendStatus(204)
    }



    // @HttpCode(204)
    // @Post('/password-recovery')
    // async passwordRecovery (@Body(new ValidationPipe()) newPasswordDto: NewPasswordDto) {
    //     const result = await this.authService.newPassword(newPasswordDto.recoveryCode, newPasswordDto.newPassword)
    //
    //     if(!result) {
    //         throw new NotFoundException('Password was not changed')
    //     }
    // }
    //
    // @HttpCode(204)
    // @Post('/new-password')
    // async newPassword (@Body(new ValidationPipe()) passwordRecoveryDto: EmailDto) {
    //     const result = await this.authService.recoveryPassword(passwordRecoveryDto.email)
    //
    //     if(!result) {
    //         throw new NotFoundException('Password was not changed')
    //     }
    // }

    @HttpCode(204)
    @Post('/password-recovery')
    async passwordRecovery (@Body(new ValidationPipe()) passwordRecoveryDto: EmailDto) {
        const result = await this.authService.recoveryPassword(passwordRecoveryDto.email)

        if(!result) {
            throw new NotFoundException('Password was not changed')
        }
    }

    @HttpCode(204)
    @Post('/new-password')
    async newPassword (@Body(new ValidationPipe()) newPasswordDto: NewPasswordDto) {
        const result = await this.authService.newPassword(newPasswordDto.recoveryCode, newPasswordDto.newPassword)
        if(!result) {
            throw new NotFoundException('Password was not changed')
        }
    }


    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/refresh-token')
    async refreshToken (
        @Request() req,
        @Res() res: Response,
         ) {

        const userId = req.userId;
        const deviceId = req.deviceId

        const user = await this.userQueryRepository.getUserById(userId)

        const {refreshToken, accessToken} = await this.customJwtService.createJWT(user, deviceId)

        const result = await this.deviceService.changeDevicesData(refreshToken)

        if (!result) {
            throw new NotFoundException('Device data was not changed')
        }
        console.log('refresh token works')
        console.log(refreshToken, accessToken)
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
        // let userIdMAin
        // console.log(req.headers.authorization)
        // const token = req.headers.authorization.split(' ')[1]
        // console.log('token', token)
        // userIdMAin = await this.jwtService.getUserIdByToken(token)
        // console.log('userIdMAin', userIdMAin.sub)
        //
        // console.log('user id',userIdMAin)
        // const user = await this.userQueryRepository.getUserById(userIdMAin)
        // console.log(user)
        if (!user) {
            throw new NotFoundException('User was not found')

        }

        res.status(200).send({email: user.email, login: user?.login, userId: userId})
    }

}