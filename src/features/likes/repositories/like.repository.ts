import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Like} from "../domain/like.entity";
import {likeStatusType} from "../../../common/types/common.types";

@Injectable()
export class LikeRepository {

    constructor(@InjectModel(Like.name) private LikeModel: Model<Like>) {}

    async getLike (userId: string, targetId: string) {
        try {
            return await this.LikeModel.findOne({userId: userId ,targetId: targetId})

        } catch (e) {
            throw new Error('Can not get like or dislike')
        }
    }

    // async getAllLikesAndDislikesForCurrentComment (targetId: string) {
    //     try {
    //         return await this.LikeModel.find({targetId: targetId}).lean()
    //
    //     } catch (e) {
    //         throw new Error('Can not get All Likes And Dislikes')
    //     }
    // }
    async getAllLikesAndDislikesForTarget(targetId: string) {
        try {
            return await this.LikeModel.find({ targetId }).lean()
        } catch (e) {
            throw new Error('Cannot get likes or dislikes for targets')
        }
    }

    async getSortedLikesForTarget(targetId: string) {
        try {
            return await this.LikeModel
                .find({type: 'Like', targetId: targetId})
                .sort({['addedAt']: -1})
                .limit(3)
                .lean()

        } catch (e) {
            throw new Error('Can not get likes or dislikes for comment')
        }
    }

    async createLike (likeData: Like) {
        try {
            await this.LikeModel.create(likeData)
            const result = await this.LikeModel.findOne({id: likeData.id}).lean()

            if (!result) {
                return null
            }

            return result

        } catch (e) {
            throw new Error('Can not get like or dislike')
        }
    }

    async updateLike(userId: string ,targetId: string, likeStatus: likeStatusType, target: string ) {

        try {
            const result = await this.LikeModel.updateOne(
                {userId, targetId: targetId, target},
                {
                    $set: {type: likeStatus, addedAt: (new Date().toISOString())}
                }
            )
            return result.modifiedCount === 1;



        } catch (e) {
            throw new Error('Can not get like ir dislike')
        }
    }

}