import {likeStatusType} from "../../../../common/types/common.types";
import {CommentDocument} from "../../domain/comment.entity";

export type CommentOutputModel = {
        id: string
        content: string
        commentatorInfo: {
        userId: string
            userLogin:string
        },
        createdAt: string
        likesInfo: {
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
    comment: CommentDocument,
    likesCount: number = 0,
    dislikesCount: number = 0,
    status: likeStatusType = "None"
): CommentOutputModel => {
    return {
        id:	comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: status
        }
    }
}