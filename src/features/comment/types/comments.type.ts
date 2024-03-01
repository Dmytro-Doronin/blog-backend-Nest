import {Comment} from "../domain/comment.entity";

export type CommentsWithPaginationType = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: Comment[]
}

export type CreatePostsServiceType = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}