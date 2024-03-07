
import {Module} from "@nestjs/common";

import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./service/auth.service";
import {AuthController} from "./controller/auth.controller";
import {DeviceModule} from "../device/device.module";
import {MailManager} from "../../common/manager/mail/mail-manager";
import {CustomJwtModule} from "../../common/jwt-module/jwt.module";
import {JwtStrategy} from "./strategies/jwt.strategy";


@Module({
    imports: [
        UserModule,
        PassportModule,
        DeviceModule,
        CustomJwtModule
    ],
    controllers: [AuthController],
    providers: [LocalStrategy, AuthService, MailManager, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}