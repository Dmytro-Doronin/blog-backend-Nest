import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor() {
        super();
    }

    validate(username: string, password: string): any {
        const isValid = (username === 'admin' && password === 'qwerty');

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return { username };
    }
}