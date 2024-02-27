import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";

import {Blog, BlogSchema} from "./domain/blog.entity";
import {BlogQueryRepository} from "./repositories/blog.query-repository";
import {BlogController} from "./controller/blog.controller";

@Module({
    imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
    controllers: [BlogController],
    providers: [BlogQueryRepository],
})
export class CatsModule {}