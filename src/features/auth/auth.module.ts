
import {Module} from "@nestjs/common";

import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./service/auth.service";
import {UserService} from "../user/service/user.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../../common/constants/jwt-constants";
import {AuthController} from "./controller/auth.controller";
import {DeviceModule} from "../device/device.module";
import {MailManager} from "../../common/manager/mail/mail-manager";


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
        DeviceModule

    ],
    controllers: [AuthController],
    providers: [LocalStrategy, AuthService, MailManager],
    exports: [AuthService],
})
export class AuthModule {}