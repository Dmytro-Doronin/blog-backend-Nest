import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../service/auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'loginOeEmail' });
    }

    async validate(loginOrEmail: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(loginOrEmail, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}