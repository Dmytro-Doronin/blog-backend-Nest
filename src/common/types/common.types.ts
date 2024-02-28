import {Posts} from "../../features/post/domain/post.entity";

type SortDirection = 'asc' | 'desc'

export type QueryBlogInputModel = {
    searchNameTerm? : string
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}

export type QueryPostInputModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}

export type AllPostWithPagination = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Posts[]
}
