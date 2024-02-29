export class QueryModelWithTerm {

    searchNameTerm: string
    sortBy: string
    sortDirection: string
    pageNumber: number
    pageSize: number

    static create(
        searchNameTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        const queryModelWithTerm = new QueryModelWithTerm();
        queryModelWithTerm.searchNameTerm = searchNameTerm
        queryModelWithTerm.sortBy = sortBy
        queryModelWithTerm.sortDirection = sortDirection
        queryModelWithTerm.pageNumber = pageNumber
        queryModelWithTerm.pageSize = pageSize
        return queryModelWithTerm;
    }

}