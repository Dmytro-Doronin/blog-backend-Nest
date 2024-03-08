import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Comment} from "../domain/comment.entity";
import {Model} from "mongoose";
import {likeStatusType} from "../../../common/types/common.types";
import {Like} from "../../likes/domain/like.entity";
import {CommentOutputModelMapper} from "../controller/models/comment.output.model";

@Injectable()
export class CommentQueryRepository {

    constructor(
        @InjectModel(Comment.name) private CommentModel: Model<Comment>,
    ) {}

    async getCommentById (commentId: string, userId: string = '') {
        try {
            const result = await this.CommentModel.findOne({id: commentId}).lean()

            return result

        } catch (e) {
            throw new Error('Comment was not found')
        }
    }

}