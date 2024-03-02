import {Module} from "@nestjs/common";
import {TestingAllDataService} from "./service/testing-all-data.service";
import {TestingAllDataController} from "./controller/testing-all-data.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogsSchema} from "../blog/domain/blog.entity";
import {Comment, CommentSchema} from "../comment/domain/comment.entity";
import {Like, LikeSchema} from "../likes/domain/like.entity";
import {Posts, PostSchema} from "../post/domain/post.entity";
import {TestingAllDataRepository} from "./repositories/testing-all-data.repository";
import {User, UserSchema} from "../user/domain/user.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
        MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),
        MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [TestingAllDataService, TestingAllDataRepository],
    controllers: [TestingAllDataController],
    exports: []
})

export class TestingAllDataModule {


}