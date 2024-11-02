import {AuthGuard} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        const req = context.switchToHttp().getRequest();
        if (err || !user) {
            console.log('User not authenticated');
            return null;
        }
        console.log('Authenticated user:', user);
        req.user = user;
        return user;
    }
}