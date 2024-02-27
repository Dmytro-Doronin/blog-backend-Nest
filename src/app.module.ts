import { Module } from '@nestjs/common';
import {CatsModule} from "./features/cats/cat.module";
import {CatsController} from "./features/cats/cat.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {User, UserSchema} from "./features/cats/domain/cat.entity";



@Module({
  imports: [
      MongooseModule.forRoot(appSettings.api.MONGO_URL),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
