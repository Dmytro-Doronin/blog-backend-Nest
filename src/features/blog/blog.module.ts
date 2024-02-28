import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";

import {Blog, BlogsSchema} from "./domain/blog.entity";
import {BlogQueryRepository} from "./repositories/blog.query-repository";
import {BlogController} from "./controller/blog.controller";
import {BlogService} from "./services/blog.service";
import {BlogRepository} from "./repositories/blog.reposirory";
import {PostModule} from "../post/post.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
        forwardRef(() => PostModule),
    ],
    controllers: [BlogController],
    providers: [BlogService, BlogQueryRepository, BlogRepository],
    exports: [BlogRepository],
})
export class BlogModule {}