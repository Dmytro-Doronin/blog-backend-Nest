import {Injectable} from "@nestjs/common";
import {UserService} from "../../user/service/user.service";
import bcrypt from "bcryptjs";
import {JwtService} from "@nestjs/jwt";
import {UserServiceModel} from "../../user/controller/models/user.output-model";
import {AuthInputDto} from "../controller/models/auth-input.dto";
import {UserQueryRepository} from "../../user/repositories/user.query-repository";
import {add} from "date-fns";
import {MailManager} from "../../../common/manager/mail/mail-manager";
const { v4: uuidv4 } = require('uuid');
@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private userQueryRepository: UserQueryRepository,
        private mailManager: MailManager

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

    async login(user: UserServiceModel) {
        const currentDate = new Date()
        const accessTokenPayload = { sub: user.id };
        const refreshTokenPayload = {
            sub: user.id,
            lastActiveDate: currentDate,
            expireDate: new Date(currentDate.getTime() + 20 * 1000),
            deviceId: uuidv4()
        };
        return {
            accessToken: this.jwtService.sign(accessTokenPayload),
            refreshToken: this.jwtService.sign(refreshTokenPayload),
        };
    }

    async registration ({login, password, email}: AuthInputDto) {
        return await this.userService.createUser({login, password, email})
    }

    async resendEmail (email: string) {
        const user = await this.userQueryRepository.findUserByLoginOrEmail(email)

        if (!user) {
            return null
        }

        if (user.emailConfirmation.isConfirmed) {
            return null
        }

        const newCode = {
            code: uuidv4(),
            date: add(new Date, {minutes: 3})
        }

        const updateConfirmation = await this.userService.updateConfirmationCode(user.id, newCode.code, newCode.date)

        if (!updateConfirmation) {
            return null
        }

        return await this.mailManager.sendConfirmationMail(user.accountData.login, user.accountData.email, newCode.code )

    }

    async registrationConfirmation(code: string) {

        const user = await this.userQueryRepository.getUserByConfirmationCode(code)

        if (!user) {
            return null
        }
        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
            return await this.userService.updateConfirmation(user.id)
        }

        return null
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}