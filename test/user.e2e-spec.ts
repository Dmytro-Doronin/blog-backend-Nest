import request = require('supertest')
import { Test, TestingModule } from '@nestjs/testing';
import {UserModule} from "../src/features/user/user.module";

describe('AuthController (e2e)', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should return all users', async () => {
        // Замените на реальные данные
        const existingUserEmail = 'vantreytest1@yandex.com';

        // Предполагается, что в вашем контроллере AuthController
        // у вас есть метод /auth/registration, и ваше приложение настроено на прослушивание порта 3000
        const response = await request(app.getHttpServer())
            .post('/auth/registration')
            .send({
                password: 'qwerty1',
                email: existingUserEmail,
                login: 'ulogin45',
            });
        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages[0].field).toBe('email');
        expect(response.body.errorsMessages[0].message).toBe('User with this email already exists');
    });

    // Повторите тест для случая, когда login уже существует

    afterEach(async () => {
        await app.close();
    });
});