import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog} from "../domain/blog.entity";
import {Model} from "mongoose";
import {QueryBlogInputModel} from "../../../common/types/common.types";
import {BlogFinalOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";
import {filterForSort} from "../../../common/utils/filterForSort";
import {ChangeBlogByIdTypes} from "../types/commonBlogTypes";



@Injectable()
export class BlogRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: Model<Blog>) {}

    async createBlogInDb(newBlog: Blog) {
        console.log(newBlog)
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

    async changeBlogByIdInDb ({id ,name, description, websiteUrl}: ChangeBlogByIdTypes) {
        try {
            const addedItem = await this.BlogModel.findOne({id: id}).lean()

            if (!addedItem) {
                return null
            }

            const result = await this.BlogModel.updateOne(
                {id: id},
                {
                    $set: {name, description, websiteUrl}
                }
            )

            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Blog was not changed by id')
        }
    }

    async deleteBlogById (id: string) {
        try {
            const res = await this.BlogModel.deleteOne({id: id})

            return res.deletedCount === 1

        } catch (e) {
            throw new Error('Blog was nod deleted')
        }
    }
}