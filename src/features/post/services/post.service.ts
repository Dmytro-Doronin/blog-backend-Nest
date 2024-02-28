import {forwardRef, Inject, Injectable, Post} from "@nestjs/common";
import {CreatePostDto} from "../controller/models/create-post.dto";
import {BlogRepository} from "../../blog/repositories/blog.reposirory";
import { v4 as uuidv4 } from 'uuid';
import {Posts} from "../domain/post.entity";
import {PostRepository} from "../repositories/post.repository";
import {PostOutputModelMapper} from "../controller/models/post.output.model";


@Injectable()
export class PostService {

    constructor(
        private blogRepository: BlogRepository,
        private postRepository: PostRepository
    ) {}

    async createPostService ({title, shortDescription, content, blogId}: CreatePostDto) {
        const blog = await this.blogRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            return null
        }


        const newPost = Posts.create(
            uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blog.name,
            (new Date().toISOString()),
        )

        const post = await this.postRepository.createPostInDb(newPost)

        if (!post) {
            return null
        }

        return PostOutputModelMapper(post)

    }

}