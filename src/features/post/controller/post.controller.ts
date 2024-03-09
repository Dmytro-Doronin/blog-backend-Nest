import {
    Body,
    Controller, Delete,
    Get,
    HttpCode, HttpException, HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Request, Res, UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {QueryPostInputModel} from "../../../common/types/common.types";
import {CommentService} from "../../comment/service/comment.service";
import {PostQueryRepository} from "../repositories/post.query-repository";
import {PostService} from "../services/post.service";
import {PostOutputModel, PostOutputModelWithPagination} from "./models/post.output.model";
import {CreateCommentsForDto, CreatePostDto, LikeStatusDto} from "./models/create-post.dto";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {Response} from "express";
import {UserQueryRepository} from "../../user/repositories/user.query-repository";
import {LikeService} from "../../likes/service/like.service";
import {QueryLikeRepository} from "../../likes/repositories/query-like.repository";
import {BasicAuthGuard} from "../../auth/guards/basic-auth.guard";

@Controller('/posts')
export class PostController {

    commentService: CommentService
    postService: PostService
    likeService: LikeService
    constructor(
        commentService: CommentService,
        postService: PostService,
        likeService: LikeService,
        private readonly postQueryRepository: PostQueryRepository,
        private readonly userQueryRepository: UserQueryRepository,
        private readonly queryLikeRepository: QueryLikeRepository

    ) {
        this.commentService = commentService
        this.postService = postService
        this.likeService = likeService
    }



    @Get()
    async getAllPost(
        @Request() req,
        @Res() res: Response,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
    ) {
        const userId = req.userId //need to add

        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const posts: PostOutputModelWithPagination = await this.postService.getAllPosts(sortData, userId)

        return res.status(200).send(posts)

    }

    @UseGuards(BasicAuthGuard)
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


    @Get('/:id')
    async getPostById (
        @Request() req,
        @Res() res: Response,
        @Param('id') postId: string
    ) {
        const userId = req.postId //need to add

        const post: PostOutputModel | null = await this.postService.getPostById(postId, userId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return res.status(200).send(post)

    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Put('/:id')
    async changePostById (
        @Param('id') postId: string,
        @Body(new ValidationPipe()) createPostDto: CreatePostDto
    ) {
        const post = await this.postQueryRepository.getPostById(postId)

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

    @UseGuards(BasicAuthGuard)
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

    @Get('/:id/comments')
    async getAllCommentsForPost (
        @Request() req,
        @Res() res: Response,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Param('id') postId: string
    ) {
        const userId = req.userId //need to add

        const post = await this.postQueryRepository.getPostById(postId)

        if(!post) {
            throw new NotFoundException('Post not found')
        }

        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const comments =  await this.commentService.getAllCommentsForPostService(postId,sortData, userId )

        return res.status(200).send(comments)

    }

    @UseGuards(JwtAuthGuard)
    @Post('/:id/comments')
    async createCommentForPost(
        @Request() req,
        @Res() res: Response,
        @Param('id') postId: string,
        @Body(new ValidationPipe()) contentDto: CreateCommentsForDto
    ) {

        const userId = req.userId

        const post = await this.postQueryRepository.getPostById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const user = await this.userQueryRepository.getUserById(userId)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const comment = await this.commentService.createComment(postId, contentDto.content, userId, user.login)

        if(!comment) {
            throw new NotFoundException('Comment not found')
        }

        res.status(201).send(comment)

    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id/like-status')
    async setLikeStatusForPosts(
        @Request() req,
        @Res() res: Response,
        @Param('id') postId: string,
        @Body(new ValidationPipe()) likeStatus: LikeStatusDto
    ) {
        const target = "Post"
        const userId = req.userId

        const post = await this.postQueryRepository.getPostById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const likeOrDislike = await this.queryLikeRepository.getLike(userId, postId)

        if (!likeOrDislike) {
            await this.likeService.createLike(postId, likeStatus.likeStatus, userId, target)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        if (likeStatus.likeStatus === likeOrDislike.type) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        const result = await this.likeService.changeLikeStatus(postId, likeStatus.likeStatus, userId, target)

        if (!result) {
            throw new NotFoundException()
        }

        return res.sendStatus(204)

    }




}