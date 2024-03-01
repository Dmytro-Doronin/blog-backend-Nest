import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    ValidationPipe
} from "@nestjs/common";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {BlogQueryRepository} from "../repositories/blog.query-repository";
import {BlogService} from "../services/blog.service";
import {CreateBolgDto, CreatePostInBolgDto} from "./models/create-blog.dto";
import {PostService} from "../../post/services/post.service";
import {PostOutputModelMapper} from "../../post/controller/models/post.output.model";
import {QueryModelWithTerm} from "../../../common/models/query.models";
import {QueryBlogInputModel, QueryPostInputModel} from "../../../common/types/common.types";

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


        const sortData: QueryBlogInputModel = {
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

    @Get('/:id/posts')
    async getAllPostInBlogController (
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber', NumberPipes) pageNumber: number,
        @Query('pageSize', NumberPipes) pageSize: number,
        @Param('id') blogId: string,
    ) {

        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const blog = await this.blogsQueryRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            throw new NotFoundException('Post not found')
        }

        return await this.postService.getAllPosts(sortData)

    }

    @Get('/:id')
    async getBlogById (@Param('id') blogId: string) {
        const blog = await this.blogsQueryRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        return blog

    }

    @HttpCode(204)
    @Put('/:id')
    async putBlogByIdController (
        @Body(new ValidationPipe()) createBlogDto: CreateBolgDto,
        @Param('id') blogId: string,

    ) {
        const result = await this.blogService.changeBlogByIdService({
            id: blogId,
            name: createBlogDto.name,
            description: createBlogDto.description ,
            websiteUrl:createBlogDto.websiteUrl
        })

        if (!result) {
            throw new NotFoundException('Blog was not changed')
        }

    }

    @HttpCode(204)
    @Delete('/:id')
    async deleteBlogsByIdController (@Param('id') blogId: string,) {
        const result = await this.blogService.deleteBlogByIdService(blogId)

        if (!result) {
            throw new NotFoundException('Blog was not deleted')
        }

    }


}