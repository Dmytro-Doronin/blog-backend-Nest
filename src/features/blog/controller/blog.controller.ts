import {
    Body,
    Controller,
    Delete,
    Get, HttpCode, InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Request, Res, UploadedFile, UseGuards, UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {BlogQueryRepository} from "../repositories/blog.query-repository";
import {BlogService} from "../services/blog.service";
import {CreateBolgDto, CreatePostInBolgDto} from "./models/create-blog.dto";
import {PostService} from "../../post/services/post.service";
import {QueryBlogInputModel, QueryPostInputModel} from "../../../common/types/common.types";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {Response} from "express";
import {OptionalJwtAuthGuard} from "../../auth/guards/optional-jwt-auth-guard.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {S3Service} from "../../../common/services/s3.service";
import {imageFileFilter} from "../../../common/utils/file-filter.utils";

@Controller('/blogs')
export class BlogController {
    blogService: BlogService;
    postService: PostService
    constructor(
        postService: PostService,
        blogService: BlogService,
        private readonly blogsQueryRepository: BlogQueryRepository,
        private readonly s3Service: S3Service,
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

    @UseGuards(JwtAuthGuard)
    @Get('/user-blogs')
    async getAllBlogsForUser (
        @Request() req,
        @Res() res: Response,
        @Query('searchNameTerm') searchNameTerm: string,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
    ) {
        const userId = req.user.userId

        const sortData: QueryBlogInputModel = {
            searchNameTerm: searchNameTerm,
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize,
        }

        const blogs = await this.blogsQueryRepository.getAllBlogInDb(sortData, userId)

        res.status(200).send(blogs)

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async createNewBlogController(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
        @Res() res: Response,
        @Body(new ValidationPipe()) createBlogDto: CreateBolgDto
    ) {

        const userId = req.user.userId

        let imageUrl = '';


        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'blogs');
        }

        const result = await this.blogService.createBlogService({
            name: createBlogDto.name,
            description: createBlogDto.description,
            websiteUrl: createBlogDto.websiteUrl,
            imageUrl: imageUrl,
            userId: userId
        })

        res.status(200).send(result)

    }

    @UseGuards(JwtAuthGuard)
    @Post('/:id/posts')
    @UseInterceptors(FileInterceptor('image'))
    async createPostToBlogController (
        @Param('id') blogId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) createPostInBlogDto: CreatePostInBolgDto
    ) {

        let imageUrl = '';
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'blogs');
        }

        const post = await this.postService.createPostService({
            title: createPostInBlogDto.title,
            shortDescription: createPostInBlogDto.shortDescription,
            content: createPostInBlogDto.content,
            blogId: blogId,
            imageUrl: imageUrl
        })

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }
    @UseGuards(OptionalJwtAuthGuard)
    @Get('/:id/posts')
    async getAllPostInBlogController (
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Param('id') blogId: string,
        @Request() req
    ) {

        const userId: string = req.user ? req.user.userId : ''
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

        return await this.postService.getAllPosts(sortData, userId, blogId)

    }

    @Get('/:id')
    async getBlogById (@Param('id') blogId: string) {
        const blog = await this.blogsQueryRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        return blog

    }


    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Put('/:id')
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async putBlogByIdController(
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) createBlogDto: CreateBolgDto,
        @Param('id') blogId: string,
    ) {
        const existingBlog = await this.blogsQueryRepository.getBlogByIdInDb(blogId);

        if (!existingBlog) {
            throw new NotFoundException('Blog not found');
        }

        let imageUrl: string | undefined = existingBlog.imageUrl;

        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'blogs');

            if (existingBlog.imageUrl) {
                const oldKey = decodeURIComponent(existingBlog.imageUrl.split('.com/')[1]);

                if (oldKey) {
                    try {
                        await this.s3Service.deleteFile(oldKey);
                    } catch (error) {
                        throw new InternalServerErrorException(
                            `Failed to delete old image with key: ${oldKey}. ${error.message}`,
                        );
                    }
                }
            }
        }


        const result = await this.blogService.changeBlogByIdService({
            id: blogId,
            name: createBlogDto.name,
            description: createBlogDto.description,
            websiteUrl: createBlogDto.websiteUrl,
            imageUrl,
        });

        if (!result) {
            throw new NotFoundException('Blog was not changed');
        }
    }

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete('/:id')
    async deleteBlogsByIdController (@Param('id') blogId: string,) {


        const existingBlog = await this.blogsQueryRepository.getBlogByIdInDb(blogId);
        if (!existingBlog) {
            throw new NotFoundException('Blog not found');
        }

        const result = await this.blogService.deleteBlogByIdService(blogId)

        if (!result) {
            throw new NotFoundException('Blog was not deleted')
        }

        if (existingBlog.imageUrl) {
            let oldKey = existingBlog.imageUrl.split('amazonaws.com/')[1]
            oldKey = decodeURIComponent(oldKey)
            if (oldKey) {
                try {
                    await this.s3Service.deleteFile(oldKey)
                } catch (error) {
                    throw new InternalServerErrorException(
                        `Failed to delete old image with key: ${oldKey}. ${error.message}`)
                }
            }
        }

    }
}