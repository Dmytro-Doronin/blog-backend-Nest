import {Posts} from "../../features/post/domain/post.entity";

type SortDirection = 'asc' | 'desc'

export type QueryBlogInputModel = {
    searchNameTerm? : string
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: string
    pageSize?: string
}

export type QueryPostInputModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: string
    pageSize?: string
}

export type AllPostWithPagination = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: Posts[]
}

export type QueryUserInputModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: string
    pageSize?: string
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type likeStatusType = "Like" | "Dislike" | "None"