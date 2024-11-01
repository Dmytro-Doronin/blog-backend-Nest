import {Injectable} from "@nestjs/common";
import {QueryPostInputModel} from "../../../common/types/common.types";
import {filterForSort} from "../../../common/utils/filterForSort";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Comment} from "../domain/comment.entity";

@Injectable()
export class CommentRepository {

    constructor(@InjectModel(Comment.name) private readonly CommentModel: Model<Comment> ) {}

    async getCommentById (commentId: string) {
        try {
            const result = await this.CommentModel.findOne({id: commentId})

            if (!result) {
                return null
            }

            return result

        } catch (e) {
            throw new Error('Comment was not found')
        }
    }

    async createCommentForPostInDb (newComments: Comment) {
        console.log('New Comment in repository:', newComments)
        try {
            await this.CommentModel.create(newComments)

            const comment = await this.CommentModel.findOne({id: newComments.id}).lean()

            if (!comment) {
                return null
            }

            return comment

        } catch (e) {
            throw new Error('Comment was not created')
        }
    }

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

    async changeCommentByIdInDb (id: string, newContent: string) {
        try {
            const result = await this.CommentModel.updateOne(
                {id: id},
                {
                    $set: {content: newContent}
                }
            )

            return result.modifiedCount === 1

        } catch (e) {
            throw new Error('Comment was not changed by id')
        }

    }

    async deleteCommentById (id: string) {
        try {
            const result = await this.CommentModel.deleteOne({id: id})

            return result.deletedCount === 1
        } catch (e) {
            throw new Error('Comment was not deleted by id')
        }

    }
}