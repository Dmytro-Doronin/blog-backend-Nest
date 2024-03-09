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
    ) {}
    async getPostById (postId: string) {
        try {
            const post = await this.PostModel.findOne({id: postId}).lean()

            return post
        } catch (e) {
            throw new Error('Post was not found')
        }
    }


}