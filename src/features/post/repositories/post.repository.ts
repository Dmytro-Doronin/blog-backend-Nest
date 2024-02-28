import {Injectable} from "@nestjs/common";
import {Posts} from "../domain/post.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";


@Injectable()
export class PostRepository {
    constructor(@InjectModel(Posts.name) private PostModel: Model<Posts>) {}

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
}