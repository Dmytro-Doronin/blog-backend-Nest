import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog} from "../domain/blog.entity";
import {Model} from "mongoose";



@Injectable()
export class BlogRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: Model<Blog>) {}

    async createBlogInDb(newBlog: Blog) {

        try {
            await this.BlogModel.create(newBlog)
            const result = await this.BlogModel.findOne({id: newBlog.id})

            if (!result) {
                return null
            }

            return result
        } catch (e) {
            throw new Error('Blog was not created')
        }
    }

    async getBlogByIdInDb (id: string)  {

        try {
            const blog = await this.BlogModel.findOne({id: id}).lean()
            if (!blog) {
                return null
            }
            return blog
        } catch (e) {
            throw new Error('Blog was not found')
        }

    }

}