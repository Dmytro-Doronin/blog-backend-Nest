import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Posts, PostSchema} from "./domain/post.entity";
import {BlogModule} from "../blog/blog.module";
import {PostRepository} from "./repositories/post.repository";
import {PostService} from "./services/post.service";
import {PostController} from "./controller/post.controller";
import {LikeModule} from "../likes/like.module";
import {Like, LikeSchema} from "../likes/domain/like.entity";
import {Comment, CommentSchema} from "../comment/domain/comment.entity";
import {CommentModule} from "../comment/comment.module";
import {PostQueryRepository} from "./repositories/post.query-repository";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        forwardRef(() => BlogModule),
        LikeModule,
        CommentModule
    ],
    controllers: [PostController],
    providers: [PostRepository, PostService, PostQueryRepository],
    exports: [PostService],
})
export class PostModule {}