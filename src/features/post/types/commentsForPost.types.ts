

export type CommentsWithPaginationType = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: Comment []
}