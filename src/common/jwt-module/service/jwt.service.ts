import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class CustomJwtService {

    constructor(
        private jwtService: JwtService,
    ) {}

    async createJWT(user: any, deviceId: string = uuidv4()) {
        const currentDate = new Date()
        const accessTokenPayload = { sub: user.id, expireDate:  5};
        const refreshTokenPayload = {
            sub: user.id,
            lastActiveDate: currentDate,
            expireDate: new Date(currentDate.getTime() + 20 * 1000),
            deviceId: deviceId
        };
        return {
            accessToken: this.jwtService.sign(accessTokenPayload),
            refreshToken: this.jwtService.sign(refreshTokenPayload),
        };
    }
   verifyRefreshToken (refreshToken: string) {
        const decodedToken = this.jwtService.verify(refreshToken);
       console.log(decodedToken)
        return decodedToken
    }

    async getUserIdByToken (token: string) {

        try {
            const result: any = this.jwtService.verify(token)
            return result.sub
        } catch (e) {
            return false
        }
    }
}