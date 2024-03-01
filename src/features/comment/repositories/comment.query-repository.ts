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
        @InjectModel(Like.name) private LikeModel: Model<Like>
    ) {}

    async getCommentById (commentId: string, userId: string = '') {
        try {
            const result = await this.CommentModel.findOne({id: commentId})

            if (!result) {
                return null
            }

            let status: likeStatusType | undefined
            if (userId) {
                const like = await this.LikeModel.findOne({targetId: commentId, userId: userId }).lean()
                status = like?.type
            }
            const allLikesAndDislikesForCurrentComment = await this.LikeModel.find({targetId: commentId}).lean();
            const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
            const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");

            return CommentOutputModelMapper(result, likes.length, dislikes.length, status )

        } catch (e) {
            throw new Error('Comment was not found')
        }
    }

}