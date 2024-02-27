import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";

import {Blogs, BlogSchema} from "./domain/blog.entity";
import {BlogQueryRepository} from "./repositories/blog.query-repository";
import {BlogController} from "./controller/blog.controller";
import {BlogService} from "./services/blog.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Blogs.name, schema: BlogSchema }])],
    controllers: [BlogController],
    providers: [BlogService, BlogQueryRepository],
})
export class BlogModule {}