import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {BlogModule} from "./features/blog/blog.module";
import {PostModule} from "./features/post/post.module";
import {LikeModule} from "./features/likes/like.module";



@Module({
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_URL),
    forwardRef(() => BlogModule),
    forwardRef(() => PostModule),
    LikeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
