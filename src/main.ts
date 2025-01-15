import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {mainAppSettings} from "./settings/main-app-settings";
import cookieParser from "cookie-parser";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    //https://blog-frontend-angular-eight.vercel.app
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });
  app.use(cookieParser());
  mainAppSettings(app)
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });


  await app.listen(3000);
}
bootstrap();
