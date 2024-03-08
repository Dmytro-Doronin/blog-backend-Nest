import {Injectable} from "@nestjs/common";
import {likeStatusType, QueryPostInputModel} from "../../../common/types/common.types";
import {CommentsWithPaginationType} from "../types/comments.type";
import {CommentRepository} from "../repositories/comment.repository";
import {LikeRepository} from "../../likes/repositories/like.repository";
import {CommentOutputModelMapper, CommentOutputModelWithPagination} from "../controller/models/comment.output.model";


@Injectable()
export class CommentService {

    constructor(
        private commentRepository: CommentRepository,
        private likeRepository: LikeRepository
    ) {}

    async getCommentByIdService (commentId: string, userId: string = '') {
        const comment = await this.commentRepository.getCommentById(commentId)

        if (!comment) {
            return null
        }

        let status: likeStatusType | undefined
        if (userId) {
            const like = await this.likeRepository.getLike(userId, commentId)
            status = like?.type
        }

        const allLikesAndDislikesForCurrentComment = await this.likeRepository.getAllLikesAndDislikesForTarget(commentId)
        const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
        const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");

        return CommentOutputModelMapper(comment, likes.length, dislikes.length, status)
    }

    async getAllCommentsForPostService (postId: string, sortData: QueryPostInputModel, userId: string = ''): Promise<CommentOutputModelWithPagination> {
        const comments: CommentsWithPaginationType = await this.commentRepository.getAllCommentForPostFromDb(postId, sortData)

        return this._mapCommentService(comments, userId)
    }

    async changeComment (commentId: string, content: string) {

        return await this.commentRepository.changeCommentByIdInDb(commentId, content)
    }

    async deleteComment(commentId: string) {
        return await this.commentRepository.deleteCommentById(commentId)
    }

    private async _mapCommentService (comments: CommentsWithPaginationType, userId: string): Promise<CommentOutputModelWithPagination> {

        const mappedItems = await Promise.all(comments.items.map(async (item) => {
            let status: likeStatusType | undefined

            if (userId) {
                const likeForCurrentComment = await this.likeRepository.getLike(userId, item.id);
                status = likeForCurrentComment?.type
            }


            const allLikesAndDislikesForCurrentComment = await this.likeRepository.getAllLikesAndDislikesForTarget(item.id);
            const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
            const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");


            return {
                id: item.id,
                content: item.content,
                commentatorInfo: item.commentatorInfo,
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: likes.length ?? 0,
                    dislikesCount: dislikes.length ?? 0,
                    myStatus: status ?? "None"
                }
            };
        }));

        return {
            pagesCount: comments.pagesCount,
            page: comments.page,
            pageSize: comments.pageSize,
            totalCount: comments.totalCount,
            items: mappedItems
        };
    }
}
