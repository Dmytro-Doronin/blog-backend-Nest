import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Like} from "../domain/like.entity";

@Injectable()
export class LikeRepository {

    constructor(@InjectModel(Like.name) private LikeModel: Model<Like>) {}

    async getLike (userId: string, targetId: string) {
        try {
            return await this.LikeModel.findOne({userId: userId ,targetId: targetId}).lean()

        } catch (e) {
            throw new Error('Can not get like or dislike')
        }
    }

    async getAllLikesAndDislikesForTarget(targetId: string) {
        try {
            return await this.LikeModel.find({targetId: targetId}).lean()

        } catch (e) {
            throw new Error('Can not get likes or dislikes for comment')
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

}