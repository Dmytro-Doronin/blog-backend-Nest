import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog} from "../../blog/domain/blog.entity";
import {Model} from "mongoose";
import {Like} from "../../likes/domain/like.entity";
import {Comment} from "../../comment/domain/comment.entity";
import {Posts} from "../../post/domain/post.entity";
import {User} from "../../user/domain/user.entity";

@Injectable()
export class TestingAllDataRepository {

    constructor(
        @InjectModel(Blog.name) private BlogModel: Model<Blog>,
        @InjectModel(Like.name) private LikeModel: Model<Like>,
        @InjectModel(Comment.name) private CommentModel: Model<Comment>,
        @InjectModel(Posts.name) private PostModel: Model<Posts>,
        @InjectModel(User.name) private UserModel: Model<User>,
    ) {}

    async deleteAllData() {
        try {
            await this.BlogModel.deleteMany({})
            await this.PostModel.deleteMany({})
            await this.LikeModel.deleteMany({})
            await this.CommentModel.deleteMany({})
            await this.UserModel.deleteMany({})
        } catch (e) {
            console.log(e)
            throw new Error('All data was not deleted')
        }
    }

}