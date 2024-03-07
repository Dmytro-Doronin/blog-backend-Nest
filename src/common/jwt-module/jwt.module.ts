import {Module} from "@nestjs/common";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../constants/jwt-constants";
import {CustomJwtService} from "./service/jwt.service";


@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [],
    providers: [CustomJwtService],
    exports: [CustomJwtService],
})
export class CustomJwtModule {}