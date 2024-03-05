
import {Module} from "@nestjs/common";

import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./service/auth.service";
import {UserService} from "../user/service/user.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../../common/constants/jwt-constants";
import {AuthController} from "./controller/auth.controller";


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [LocalStrategy, AuthService, JwtService],
    exports: [AuthService],
})
export class AuthModule {}