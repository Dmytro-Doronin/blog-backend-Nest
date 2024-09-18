import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {mainAppSettings} from "./settings/main-app-settings";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  mainAppSettings(app)

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
