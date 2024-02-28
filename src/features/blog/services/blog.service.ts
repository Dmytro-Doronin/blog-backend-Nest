import {Injectable} from "@nestjs/common";
import {CreateBolgDto} from "../controller/models/create-blog.dto";
import { v4 as uuidv4 } from 'uuid';
import {Blog} from "../domain/blog.entity";
import {BlogRepository} from "../repositories/blog.reposirory";
import {BlogOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";

@Injectable()
export class BlogService {

    constructor(private readonly blogRepository: BlogRepository) {}

    async createBlogService({name, description, websiteUrl} : CreateBolgDto): Promise<BlogOutputModel | null>  {
        const newBlog: Blog = {
            id: uuidv4(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blog = await this.blogRepository.createBlogInDb(newBlog)

        if (!blog) {
            return null
        }

        return BlogOutputModelMapper(blog)
    }
}