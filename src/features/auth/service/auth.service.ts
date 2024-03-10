import {Injectable} from "@nestjs/common";
import {UserService} from "../../user/service/user.service";
import bcrypt from "bcryptjs";
import {UserOutputModel, UserServiceModel} from "../../user/controller/models/user.output-model";
import {AuthInputDto} from "../controller/models/auth-input.dto";
import {add} from "date-fns";
import {MailManager} from "../../../common/manager/mail/mail-manager";
import {UserRepository} from "../../user/repositories/user.repository";
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service";
const { v4: uuidv4 } = require('uuid');
@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: CustomJwtService,
        private mailManager: MailManager,
        private userRepository: UserRepository,
        // private createJwtService: CreateJwtService

    ) {}

    async validateUser (loginOrEmail: string, password: string): Promise<UserServiceModel | null> {
        const user: UserServiceModel | null = await this.userService.checkAuthCredentials(loginOrEmail)

        if (!user) return null

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash === passwordHash) {
            return user
        }

        return null

    }

    async createJWT(user: UserOutputModel | UserServiceModel) {

        const {refreshToken, accessToken} = await this.jwtService.createJWT(user)
        // const currentDate = new Date()
        // const accessTokenPayload = { sub: user.id };
        // const refreshTokenPayload = {
        //     sub: user.id,
        //     lastActiveDate: currentDate,
        //     expireDate: new Date(currentDate.getTime() + 20 * 1000),
        //     deviceId: uuidv4()
        // };
        return {
            accessToken,
            refreshToken
        };


    }


    async registration ({login, password, email}: AuthInputDto) {
        return await this.userService.createUser({login, password, email})
    }

    async resendEmail (email: string) {
        const user = await this.userRepository.findUserByLoginOrEmail(email)

        if (!user) {
            return null
        }

        if (user.emailConfirmation.isConfirmed) {
            return false
        }

        const newCode = {
            code: uuidv4(),
            date: add(new Date, {minutes: 3})
        }

        const updateConfirmation = await this.userRepository.updateConfirmationCode(user.id, newCode.code, newCode.date)

        if (!updateConfirmation) {
            return null
        }

        return await this.mailManager.sendConfirmationMail(user.accountData.login, user.accountData.email, newCode.code )
    }

    async registrationConfirmation(code: string) {
        const user = await this.userRepository.getUserByConfirmationCode(code)

        if (!user) {
            return null
        }


        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
            return await this.userRepository.updateConfirmation(user.id)
        }

        return null
    }

    async newPassword (recoveryCode: string, newPassword: string) {

        const user = await this.userRepository.getUserByPasswordRecoveryCode(recoveryCode)

        if (!user) {
            return null
        }

        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)

        return await this.userRepository.updatePassword(passwordSalt, passwordHash, user.id)
    }

    async recoveryPassword (email: string) {

        const user = await this.userRepository.findUserByLoginOrEmail(email)

        if (!user) {
            return null
        }

        const data = {
            code: uuidv4(),
            date: add(new Date, {minutes: 3})
        }

        const updateRecoveryCode = await this.userRepository.updatePasswordRecoveryCode(user.id, data.code, data.date)

        if (!updateRecoveryCode) {
            return null
        }

        return await this.mailManager.sendRecoveryPasswordMail(user.accountData.login, user.accountData.email, data.code)

    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}