import {forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
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
import {CustomJwtModule} from "./common/jwt-module/jwt.module";
import {CustomAuthMiddleware} from "./common/jwt-module/middleware/custom-auth.middleware";


@Module({
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_URL),
    forwardRef(() => BlogModule),
    forwardRef(() => PostModule),
    LikeModule,
    CommentModule,
    TestingAllDataModule,
    UserModule,
    AuthModule,
    DeviceModule,
    CustomJwtModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(CustomAuthMiddleware)
        .forRoutes(
            { path: '/comments/:id', method: RequestMethod.GET },
            { path: '/posts', method: RequestMethod.GET },
            { path: '/posts/:id', method: RequestMethod.GET },
            { path: '/posts/:id/comments', method: RequestMethod.GET },
            { path: '/auth/me', method: RequestMethod.GET },
        )
  }
}
