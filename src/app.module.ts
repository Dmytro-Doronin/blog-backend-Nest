import { Module } from '@nestjs/common';
import {CatsModule} from "./features/cats/cat.module";
import {CatsController} from "./features/cats/controller/cat.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {Cat, UserSchema} from "./features/cats/domain/cat.entity";



@Module({
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_URL),
    CatsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
