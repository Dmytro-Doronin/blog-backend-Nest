import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Like} from "../domain/like.entity";
import {Model} from "mongoose";

@Injectable()
export class QueryLikeRepository {

    constructor(@InjectModel(Like.name) private LikeModel: Model<Like>) {}

    async getLike (userId: string, targetId: string, target: 'Post' | 'Comment') {
        try {
            return await this.LikeModel.findOne({userId: userId ,targetId: targetId, target }).lean()

        } catch (e) {
            throw new Error('Can not get like or dislike')
        }
    }

}