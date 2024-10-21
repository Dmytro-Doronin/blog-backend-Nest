import {Injectable} from "@nestjs/common";
import {CreateBolgDto} from "../controller/models/create-blog.dto";
import { v4 as uuidv4 } from 'uuid';
import {Blog} from "../domain/blog.entity";
import {BlogRepository} from "../repositories/blog.reposirory";
import {BlogOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";
import {ChangeBlogByIdTypes} from "../types/commonBlogTypes";
import {UserRepository} from "../../user/repositories/user.repository";

@Injectable()
export class BlogService {

    constructor(private readonly blogRepository: BlogRepository, private readonly userRepository: UserRepository) {}

    async createBlogService({name, description, websiteUrl, userId} : CreateBolgDto & {userId: string}): Promise<BlogOutputModel | null>  {
        const user = await this.userRepository.getUserById(userId)
        if(!user) {
            return null
        }
        const newBlog = Blog.create(
            uuidv4(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false,
            userId,
            user.accountData.login
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