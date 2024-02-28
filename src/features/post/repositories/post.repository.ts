import {Injectable} from "@nestjs/common";
import {Posts} from "../domain/post.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {AllPostWithPagination, QueryPostInputModel} from "../../../common/types/common.types";
import {filterForSort} from "../../../common/utils/filterForSort";


@Injectable()
export class PostRepository {
    constructor(@InjectModel(Posts.name) private PostModel: Model<Posts>) {}

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

            return {}
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

    // private async _mapPosts (posts: AllPostWithPagination, userId: string) {
    //     const mappedItems = await Promise.all(posts.items.map(async (item) => {
    //         let status: likeStatusType | undefined
    //
    //         if (userId) {
    //             const likeForCurrentComment = await likeMutation.getLike(userId, item.id);
    //             status = likeForCurrentComment?.type
    //         }
    //
    //
    //         const allLikesAndDislikesForCurrentComment = await likeMutation.getAllLikesAndDislikesForComment(item.id);
    //         const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
    //         const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");
    //
    //
    //         const likesFromDb = await LikeModel
    //             .find({type: 'Like', targetId: item.id,})
    //             .sort({['addedAt']: -1})
    //             .limit(3)
    //             .lean()
    //
    //         const newestLikes = likesFromDb.map(item => {
    //             return {
    //                 addedAt: item.addedAt,
    //                 userId: item.userId,
    //                 login: item.login
    //             }
    //         })
    //
    //         return {
    //             id: item.id,
    //             title: item.title,
    //             shortDescription: item.shortDescription,
    //             content: item.content,
    //             blogId: item.blogId,
    //             blogName: item.blogName,
    //             createdAt: item.createdAt,
    //             extendedLikesInfo: {
    //                 likesCount: likes.length ?? 0,
    //                 dislikesCount: dislikes.length ?? 0,
    //                 myStatus: status ?? "None",
    //                 newestLikes : newestLikes
    //             }
    //         };
    //     }));
    //
    //     return {
    //         pagesCount: posts.pagesCount,
    //         page: posts.page,
    //         pageSize: posts.pageSize,
    //         totalCount: posts.totalCount,
    //         items: mappedItems
    //     };
    // }
}