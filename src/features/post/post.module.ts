import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Posts, PostSchema} from "./domain/post.entity";
import {BlogModule} from "../blog/blog.module";
import {PostRepository} from "./repositories/post.repository";
import {PostService} from "./services/post.service";
import {PostController} from "./controller/post.controller";
import {LikeModule} from "../likes/like.module";
import {CommentModule} from "../comment/comment.module";
import {PostQueryRepository} from "./repositories/post.query-repository";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
        forwardRef(() => BlogModule),
        LikeModule,
        CommentModule,
        AuthModule,
        UserModule
    ],
    controllers: [PostController],
    providers: [PostRepository, PostService, PostQueryRepository],
    exports: [PostService],
})
export class PostModule {}