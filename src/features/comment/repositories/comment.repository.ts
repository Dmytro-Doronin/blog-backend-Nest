import {Injectable} from "@nestjs/common";
import {QueryPostInputModel} from "../../../common/types/common.types";
import {filterForSort} from "../../../common/utils/filterForSort";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Comment} from "../domain/comment.entity";

@Injectable()
export class CommentRepository {

    constructor(@InjectModel(Comment.name) private readonly CommentModel: Model<Comment> ) {}

    async getAllCommentForPostFromDb(postId: string, sortData: QueryPostInputModel) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10


        try {
            const comment = await this.CommentModel
                .find({postId: postId})
                .sort(filterForSort(sortBy, sortDirection))
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean()

            const totalCount = await this.CommentModel.countDocuments({postId: postId})

            const pagesCount = Math.ceil(totalCount / +pageSize)

            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: comment
            }


        } catch (e) {
            throw new Error('Comments was not get')
        }
    }
}