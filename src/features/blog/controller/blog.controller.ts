import {Body, Controller, Get, NotFoundException, Param, Post, Query, ValidationPipe} from "@nestjs/common";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {BlogQueryRepository} from "../repositories/blog.query-repository";
import {BlogService} from "../services/blog.service";
import {CreateBolgDto, CreatePostInBolgDto} from "./models/create-blog.dto";
import {PostService} from "../../post/services/post.service";
import {PostOutputModelMapper} from "../../post/controller/models/post.output.model";

@Controller('/blogs')
export class BlogController {
    blogService: BlogService;
    postService: PostService
    constructor(
        postService: PostService,
        blogService: BlogService,
        private readonly blogsQueryRepository: BlogQueryRepository,
    ) {
        this.blogService = blogService
        this.postService = postService
    }
    @Get()
    async getAllBlogs (
        @Query('searchNameTerm') searchNameTerm: string,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber', NumberPipes) pageNumber: number,
        @Query('pageSize', NumberPipes) pageSize: number,
    ) {
        const sortData = {
            searchNameTerm: searchNameTerm,
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const blogs = await this.blogsQueryRepository.getAllBlogInDb(sortData)

        return blogs

    }

    @Post()
    async createNewBlogController(@Body(new ValidationPipe()) createBlogDto: CreateBolgDto) {

        const result = await this.blogService.createBlogService({
            name: createBlogDto.name,
            description: createBlogDto.description,
            websiteUrl: createBlogDto.websiteUrl
        })

        return result

    }

    @Post('/:id/posts')
    async createPostToBlogController (
        @Param('id') blogId: string,
        @Body(new ValidationPipe()) createPostInBlogDto: CreatePostInBolgDto
    ) {
        const post = await this.postService.createPostService({
            title: createPostInBlogDto.title,
            shortDescription: createPostInBlogDto.shortDescription,
            content: createPostInBlogDto.content,
            blogId: blogId

        })

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }


}