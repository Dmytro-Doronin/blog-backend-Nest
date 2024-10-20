
// export const filterForSort = (sortBy: string, sortDirection: string ): {[key: string]: 1 | -1} => {
//     if (sortDirection === 'asc') {
//         return {[`accountData.${sortBy}`]: 1}
//     } else {
//         return {[`accountData.${sortBy}`]: -1 }
//     }
// }

export const filterForSort = (sortBy: string, sortDirection: string): { [key: string]: 1 | -1 } => {
    if (sortDirection === 'asc') {
        return { [sortBy]: 1 }
    } else {
        return { [sortBy]: -1 }
    }
}