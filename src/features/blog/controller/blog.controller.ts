import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Request, Res, UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {BlogQueryRepository} from "../repositories/blog.query-repository";
import {BlogService} from "../services/blog.service";
import {CreateBolgDto, CreatePostInBolgDto} from "./models/create-blog.dto";
import {PostService} from "../../post/services/post.service";
import {QueryBlogInputModel, QueryPostInputModel} from "../../../common/types/common.types";
import {BasicAuthGuard} from "../../auth/guards/basic-auth.guard";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {Response} from "express";

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
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
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

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    async createNewBlogController(
        @Request() req,
        @Res() res: Response,
        @Body(new ValidationPipe()) createBlogDto: CreateBolgDto
    ) {
        const userId = req.user.userId
        console.log('user id in controller', userId)
        const result = await this.blogService.createBlogService({
            name: createBlogDto.name,
            description: createBlogDto.description,
            websiteUrl: createBlogDto.websiteUrl,
            userId: userId
        })

        res.status(200).send(result)

    }

    @UseGuards(BasicAuthGuard)
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
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Param('id') blogId: string,
    ) {

        const userId: string = ''

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

        return await this.postService.getAllPosts(sortData,userId, blogId)

    }

    @Get('/:id')
    async getBlogById (@Param('id') blogId: string) {
        const blog = await this.blogsQueryRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        return blog

    }

    @UseGuards(BasicAuthGuard)
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

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete('/:id')
    async deleteBlogsByIdController (@Param('id') blogId: string,) {
        const result = await this.blogService.deleteBlogByIdService(blogId)

        if (!result) {
            throw new NotFoundException('Blog was not deleted')
        }

    }
}