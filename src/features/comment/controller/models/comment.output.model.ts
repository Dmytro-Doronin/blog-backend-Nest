import {likeStatusType} from "../../../../common/types/common.types";
import {CommentDocument} from "../../domain/comment.entity";

export class CommentOutputModel {
        id: string
        content: string
        commentatorInfo: {
            userId: string
            userLogin:string
        }
        createdAt: string
        likesInfo?: {
            likesCount: number,
            dislikesCount: number,
            myStatus: likeStatusType
        }
}

export type CommentOutputModelWithPagination = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: CommentOutputModel []
}




export const CommentOutputModelMapper = (
    comment: CommentOutputModel,
    likesCount: number = 0,
    dislikesCount: number = 0,
    status: likeStatusType = "None"
): CommentOutputModel => {

    const newComment = new CommentOutputModel ()

    newComment.id = comment.id
    newComment.content = comment.content
    newComment.commentatorInfo = {...comment.commentatorInfo}
    newComment.createdAt = comment.createdAt
    newComment.likesInfo = {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: status
    }
    return newComment
}