import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Posts, PostSchema} from "./domain/post.entity";
import {BlogModule} from "../blog/blog.module";
import {PostRepository} from "./repositories/post.repository";
import {PostService} from "./services/post.service";
import {BlogRepository} from "../blog/repositories/blog.reposirory";
import {PostController} from "./controller/post.controller";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
        // forwardRef(() => BlogModule)
    ],
    controllers: [PostController],
    providers: [PostRepository, PostService],
    exports: [PostService],
})
export class PostModule {}