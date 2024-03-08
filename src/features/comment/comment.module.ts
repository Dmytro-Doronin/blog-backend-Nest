
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Comment, CommentSchema} from "./domain/comment.entity";
import {Like, LikeSchema} from "../likes/domain/like.entity";
import {CommentQueryRepository} from "./repositories/comment.query-repository";
import {CommentController} from "./controller/comment.controller";
import {CommentService} from "./service/comment.service";
import {LikeModule} from "../likes/like.module";
import {CommentRepository} from "./repositories/comment.repository";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
        LikeModule
    ],
    controllers: [CommentController],
    providers: [CommentQueryRepository, CommentService, CommentRepository],
    exports: [CommentService]
})

export class CommentModule {}
