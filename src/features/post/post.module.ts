import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Posts, PostSchema} from "./domain/post.entity";
import {BlogModule} from "../blog/blog.module";
import {PostRepository} from "./repositories/post.repository";
import {PostService} from "./services/post.service";
import {PostController} from "./controller/post.controller";
import {LikeModule} from "../likes/like.module";
import {Like, LikeSchema} from "../likes/domain/like.entity";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        forwardRef(() => BlogModule),
        LikeModule
    ],
    controllers: [PostController],
    providers: [PostRepository, PostService],
    exports: [PostService],
})
export class PostModule {}