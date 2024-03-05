import {Injectable} from "@nestjs/common";
import {UserService} from "../../user/service/user.service";
import bcrypt from "bcryptjs";
import {JwtService} from "@nestjs/jwt";
import {UserServiceModel} from "../../user/controller/models/user.output-model";
const { v4: uuidv4 } = require('uuid');
@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser (loginOrEmail: string, password: string): Promise<UserServiceModel | null> {
        const user: UserServiceModel | null = await this.userService.checkAuthCredentials(loginOrEmail)

        if (!user) return null

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash === passwordHash) {
            return user
        } else {
            return null
        }

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



    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}