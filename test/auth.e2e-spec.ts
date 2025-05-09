import request = require('supertest')
import { Test, TestingModule } from '@nestjs/testing';
import {AppModule} from "../src/app.module";
import {isLogLevelEnabled} from "@nestjs/common/services/utils";

describe('AuthController (e2e)', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/registration (POST) - should return error if email already exists', async () => {
        const existingUserEmail = 'vantreytest1@yandex.com';

        const response = await request(app.getHttpServer())
            .post('/auth/registration')
            .send({
                password: 'qwerty1',
                email: existingUserEmail,
                login: 'ulogin45',
            });
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages[0].field).toBe('email');
        expect(response.body.errorsMessages[0].message).toBe('User with this email already exists');
    });


    afterEach(async () => {
        await app.close();
    });
});