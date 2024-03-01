import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Posts} from "../domain/post.entity";
import {Model} from "mongoose";
import {Like} from "../../likes/domain/like.entity";
import {likeStatusType} from "../../../common/types/common.types";


@Injectable()
export class PostQueryRepository {

    constructor(
        @InjectModel(Posts.name) private PostModel: Model<Posts>,
        @InjectModel(Like.name) private LikeModel: Model<Like>,
    ) {}
    async getPostById (postId: string, userId: string = '') {
        try {
            const post = await this.PostModel.findOne({id: postId}).lean()

            if (!post) {
                return null
            }

            let status: likeStatusType | undefined
            if (userId) {
                const like = await this.LikeModel.findOne({targetId: postId, userId: userId}).lean()
                status = like?.type
            }
            const allLikesAndDislikesForCurrentComment = await this.LikeModel.find({targetId: postId}).lean();
            const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
            const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");

            const likesFromDb = await this.LikeModel
                .find({type: 'Like', targetId: postId, target: 'Post'})
                .sort({['addedAt']: -1})
                .limit(3)
                .lean()

            const newestLikes = likesFromDb.map(item => {
                return {
                    addedAt: item.addedAt,
                    userId: item.userId,
                    login: item.login
                }
            })

            return {
                id:	post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likes.length ?? 0,
                    dislikesCount: dislikes.length ?? 0,
                    myStatus: status ?? "None",
                    newestLikes : newestLikes ?? []
                }
            }
        } catch (e) {
            throw new Error('Post was not found')
        }
    }


}