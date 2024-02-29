import {Injectable} from "@nestjs/common";
import {CreateBolgDto} from "../controller/models/create-blog.dto";
import { v4 as uuidv4 } from 'uuid';
import {Blog} from "../domain/blog.entity";
import {BlogRepository} from "../repositories/blog.reposirory";
import {BlogOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";
import {ChangeBlogByIdTypes} from "../types/commonBlogTypes";

@Injectable()
export class BlogService {

    constructor(private readonly blogRepository: BlogRepository) {}

    async createBlogService({name, description, websiteUrl} : CreateBolgDto): Promise<BlogOutputModel | null>  {

        const newBlog = Blog.create(
            uuidv4(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )

        const blog = await this.blogRepository.createBlogInDb(newBlog)

        if (!blog) {
            return null
        }

        return BlogOutputModelMapper(blog)
    }

    async changeBlogByIdService ({id ,name, description, websiteUrl} : ChangeBlogByIdTypes) {
        return await this.blogRepository.changeBlogByIdInDb({id ,name, description, websiteUrl})
    }

    async deleteBlogByIdService(id: string) {
        return await this.blogRepository.deleteBlogById(id)
    }
}