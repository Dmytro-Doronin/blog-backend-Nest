import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {mainAppSettings} from "./settings/main-app-settings";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blog-backend-nest.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);  // Отвечаем на предзапрос
    } else {
      next();
    }
  });

  mainAppSettings(app)
  app.enableCors({
    origin: 'https://blog-backend-nest.vercel.app',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,  // Останавливает предзапросы на уровне CORS
    optionsSuccessStatus: 204  // Устанавливает успешный код ответа для OPTIONS
  });
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });



  await app.listen(3000);
}
bootstrap();
