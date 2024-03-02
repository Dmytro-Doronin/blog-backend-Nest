import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    ValidationPipe
} from "@nestjs/common";
import {QueryPostInputModel} from "../../../common/types/common.types";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {CommentService} from "../../comment/service/comment.service";
import {PostQueryRepository} from "../repositories/post.query-repository";
import {PostService} from "../services/post.service";
import {PostOutputModel, PostOutputModelWithPagination} from "./models/post.output.model";
import {CreatePostInBolgDto} from "../../blog/controller/models/create-blog.dto";
import {CreatePostDto} from "./models/create-post.dto";

@Controller('/posts')
export class PostController {

    commentService: CommentService
    postService: PostService
    constructor(
        commentService: CommentService,
        postService: PostService,
        private readonly postQueryRepository: PostQueryRepository
    ) {
        this.commentService = commentService
        this.postService = postService
    }

    @Get('/:id/comments')
    async getAllCommentsForPost (
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Param('id') postId: string
    ) {
        const userId = '' //need to add

        const post: PostOutputModel | null = await this.postQueryRepository.getPostById(postId)

        if(!post) {
            throw new NotFoundException('Post not found')
        }

        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        return await this.commentService.getAllCommentsForPostService(postId,sortData, userId )

    }


    @Get()
    async getAllPost(
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
    ) {
        const userId = '' //need to add

        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const posts: PostOutputModelWithPagination = await this.postService.getAllPosts(sortData, userId)

        return posts

    }


    @Get('/:id')
    async getPostById (@Param('id') postId: string): Promise<PostOutputModel> {
        const userId = '' //need to add

        const post: PostOutputModel | null = await this.postQueryRepository.getPostById(postId, userId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post

    }


    @Post()
    async createPost (
        @Body(new ValidationPipe()) createPostDto: CreatePostDto
    ) {
        const post = await this.postService.createPostService({
            title: createPostDto.title,
            shortDescription: createPostDto.shortDescription,
            content: createPostDto.content,
            blogId: createPostDto.blogId
        })

        if (!post) {
            throw new NotFoundException('Post was not created')
        }

        return post
    }


    @HttpCode(204)
    @Put('/:id')
    async changePostById (
        @Param('id') postId: string,
        @Body(new ValidationPipe()) createPostDto: CreatePostDto
    ) {
        const post: PostOutputModel | null = await this.postQueryRepository.getPostById(postId)

        if(!post) {
            throw new NotFoundException('Post not found')
        }

        const result = await this.postService.changePostByIdService({
            id: postId,
            title: createPostDto.title,
            shortDescription: createPostDto.shortDescription,
            content: createPostDto.content,
            blogId: createPostDto.blogId
        })

        if (!result) {
            throw new NotFoundException('Post was not changed')
        }

    }

    @HttpCode(204)
    @Delete('/:id')
    async deletePOstById (
        @Param('id') postId: string,
    ) {
        const post = await this.postQueryRepository.getPostById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const result = await this.postService.deletePostById(postId)

        if (!result) {
            throw new NotFoundException('Post was not delete')
        }

    }

}