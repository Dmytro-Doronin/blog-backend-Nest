import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "./settings/app-settings";
import {BlogModule} from "./features/blog/blog.module";
import {PostModule} from "./features/post/post.module";
import {LikeModule} from "./features/likes/like.module";
import {CommentModule} from "./features/comment/comment.module";
import {TestingAllDataModule} from "./features/testing-all-data/testing-all-data.module";
import {UserModule} from "./features/user/user.module";
import {AuthModule} from "./features/auth/auth.module";
import {DeviceModule} from "./features/device/device.module";
// import {ConfigModule} from '@nestjs/config'


@Module({
  imports: [
      // ConfigModule.forRoot(),
    MongooseModule.forRoot(appSettings.api.MONGO_URL),
    forwardRef(() => BlogModule),
    forwardRef(() => PostModule),
    LikeModule,
    CommentModule,
    TestingAllDataModule,
    UserModule,
    AuthModule,
    DeviceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
