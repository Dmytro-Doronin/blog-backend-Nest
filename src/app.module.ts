import { Module } from '@nestjs/common';
import {CatsModule} from "./features/cats/cat.module";
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {BlogModule} from "./features/blog/blog.module";



@Module({
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_URL),
    CatsModule,
    BlogModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
