import {Injectable} from "@nestjs/common";
import {Posts} from "../domain/post.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {AllPostWithPagination, QueryPostInputModel} from "../../../common/types/common.types";
import {filterForSort} from "../../../common/utils/filterForSort";
import {Comment} from "../../comment/domain/comment.entity";
import {CreatePostsServiceType} from "../../comment/types/comments.type";


@Injectable()
export class PostRepository {
    constructor(
        @InjectModel(Posts.name) private PostModel: Model<Posts>,
    ) {}

    async getPostById (postId: string) {
        try {
            const post = await this.PostModel.findOne({id: postId})

            if (!post) {
                return null
            }

            return post
        } catch (e) {
            throw new Error('Post was not get')
        }
    }

    async getAllPosts (sortData: QueryPostInputModel, userId: string, blogId: null | string = null) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter

        if (blogId) {
            filter = { blogId: blogId }
        } else {
            filter = {}
        }

        try {
            const posts = await this.PostModel
                .find(filter)
                .sort(filterForSort(sortBy, sortDirection))
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean()

            const totalCount = await this.PostModel.countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / +pageSize)

            const postsWithPagination: AllPostWithPagination = {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: posts
            }

            return postsWithPagination
        } catch (e) {
            throw new Error('Posts was not get')
        }
    }

    async createPostInDb (newPost : Posts) {
        try {

            await this.PostModel.create(newPost)
            const result = await this.PostModel.findOne({id: newPost.id})

            if (!result) {
                return null
            }

            return result
        } catch (e) {
            throw new Error('Post was not add')
        }

    }

    async changePostById ({id, title, shortDescription, content, blogId, imageUrl}: CreatePostsServiceType& {imageUrl?: string}) {
        try {
            const updateData: any = {
                id,
                title,
                shortDescription,
                content,
                blogId
            }

            if (imageUrl) {
                updateData.imageUrl = imageUrl
            }

            const result = await this.PostModel.updateOne(
                {id: id},
                {
                    $set: updateData
                }
            )

            return !!result.matchedCount
        } catch (e) {
            throw new Error('Blog was not changed by id')
        }
    }

    async deletePostById (id: string) {
        try {
            const res = await this.PostModel.deleteOne({id: id})

            return res.deletedCount === 1

        } catch (e) {
            throw new Error('Blog was nod deleted')
        }
    }
}