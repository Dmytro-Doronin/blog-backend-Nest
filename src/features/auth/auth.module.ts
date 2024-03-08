
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
import {BasicAuthStrategy} from "./strategies/basic.strategy";
import {BasicAuthGuard} from "./guards/basic-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {CustomAuthMiddleware} from "../../common/jwt-module/middleware/custom-auth.middleware";


@Module({
    imports: [
        UserModule,
        PassportModule,
        DeviceModule,
        CustomJwtModule
    ],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        AuthService,
        MailManager,
        JwtStrategy,
        BasicAuthStrategy,
        BasicAuthGuard,
        JwtAuthGuard,
        LocalAuthGuard,
    ],
    exports: [
        AuthService,
        BasicAuthGuard,
        JwtAuthGuard,
        LocalAuthGuard,
    ],
})
export class AuthModule {}