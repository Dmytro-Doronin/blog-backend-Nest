import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {mainAppSettings} from "./settings/main-app-settings";
import cookieParser from "cookie-parser";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
    // app.use((req, res, next) => {
    //     if (req.method === 'OPTIONS') {
    //         res.header('Access-Control-Allow-Origin', 'https://blog-frontend-angular-eight.vercel.app');
    //         res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    //         res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    //         res.header('Access-Control-Allow-Credentials', 'true');
    //         return res.status(204).send();
    //     }
    //     next();
    // });
  app.use(cookieParser());
  mainAppSettings(app)
  app.enableCors({
    origin: [
        'https://blog-frontend-angular-eight.vercel.app',
        'http://localhost:5173',
        'https://lead-blog-adcd.vercel.app'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });


  await app.listen(3000);
}
bootstrap();
