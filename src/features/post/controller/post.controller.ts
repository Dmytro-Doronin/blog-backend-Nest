import {
    Body,
    Controller, Delete,
    Get,
    HttpCode, HttpException, HttpStatus, InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Req, Request, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors,
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
import {OptionalJwtAuthGuard} from "../../auth/guards/optional-jwt-auth-guard.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {s3} from "../../../../aws.config";
import {S3Service} from "../../../common/services/s3.service";
import {imageFileFilter} from "../../../common/utils/file-filter.utils";

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
        private readonly queryLikeRepository: QueryLikeRepository,
        private readonly s3Service: S3Service,

    ) {
        this.commentService = commentService
        this.postService = postService
        this.likeService = likeService
    }


    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    async getAllPost(
        @Request() req,
        @Res() res: Response,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
    ) {
        const userId: string = req.user ? req.user.userId : '' //need to add
        const sortData: QueryPostInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const posts: PostOutputModelWithPagination = await this.postService.getAllPosts(sortData, userId)

        return res.status(200).send(posts)

    }
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    // @UseGuards(BasicAuthGuard)
    @Post()
    async createPost (
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) createPostDto: CreatePostDto
    ) {

        let imageUrl = '';
        // if (file) {
        //     const uploadResult = await s3.upload({
        //         Bucket: process.env.AWS_BUCKET_NAME as string,
        //         Key: `blogs/${Date.now()}_${file.originalname}`,
        //         Body: file.buffer,
        //         ContentType: file.mimetype,
        //     }).promise();
        //
        //     imageUrl = uploadResult.Location;
        // }

        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'blogs');
        }

        const post = await this.postService.createPostService({
            title: createPostDto.title,
            shortDescription: createPostDto.shortDescription,
            content: createPostDto.content,
            blogId: createPostDto.blogId,
            imageUrl: imageUrl
        })

        if (!post) {
            throw new NotFoundException('Post was not created')
        }

        return post
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('/:id')
    async getPostById (
        @Request() req,
        @Res() res: Response,
        @Param('id') postId: string
    ) {
        const userId = req.user ? req.user.userId : '' //need to add

        const post: PostOutputModel | null = await this.postService.getPostById(postId, userId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }
        return res.status(200).send(post)

    }

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    @HttpCode(204)
    @Put('/:id')
    async changePostById (
        @Param('id') postId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) createPostDto: CreatePostDto
    ) {

        const existingPost = await this.postQueryRepository.getPostById(postId)

        if(!existingPost) {
            throw new NotFoundException('Post not found')
        }

        let imageUrl: string | undefined = existingPost.imageUrl;


        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'blogs');

            if (existingPost.imageUrl) {
                let oldKey = existingPost.imageUrl.split('.com/')[1]
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



        const result = await this.postService.changePostByIdService({
            id: postId,
            title: createPostDto.title,
            shortDescription: createPostDto.shortDescription,
            content: createPostDto.content,
            blogId: createPostDto.blogId,
            imageUrl: imageUrl
        })

        if (!result) {
            throw new NotFoundException('Post was not changed')
        }

    }

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete('/:id')
    async deletePOstById (
        @Param('id') postId: string,
    ) {
        const existingPost = await this.postQueryRepository.getPostById(postId)

        if (!existingPost) {
            throw new NotFoundException('Post not found')
        }

        const result = await this.postService.deletePostById(postId)

        if (!result) {
            throw new NotFoundException('Post was not delete')
        }

        if (existingPost.imageUrl) {
            let oldKey = existingPost.imageUrl.split('amazonaws.com/')[1]
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

    @UseGuards(OptionalJwtAuthGuard)
    @Get('/:id/comments')
    async getAllCommentsForPost (
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Param('id') postId: string,
        @Request() req
    ) {
        const userId: string = req.user ? req.user.userId : ''

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
        return comments


    }

    @UseGuards(JwtAuthGuard)
    @Post('/:id/comments')
    async createCommentForPost(
        @Request() req,
        @Res() res: Response,
        @Param('id') postId: string,
        @Body(new ValidationPipe()) contentDto: CreateCommentsForDto
    ) {

        const userId = req.user.userId
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }

        const post = await this.postQueryRepository.getPostById(postId)
        if (!post) {
            throw new NotFoundException('Post not found')
        }
        const user = await this.userQueryRepository.getUserById(userId)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const comment = await this.commentService.createComment(postId, contentDto.content, userId, user.login, user.imageUrl)
        if(!comment) {
            throw new NotFoundException('Comment not found')
        }

        res.status(201).send(comment)

    }
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Put('/:id/like-status')
    async setLikeStatusForPosts(
        @Request() req,
        @Param('id') postId: string,
        @Body(new ValidationPipe()) likeStatus: LikeStatusDto
    ) {
        const target = "Post"
        const userId = req.user.userId
        console.log(likeStatus)
        const post = await this.postQueryRepository.getPostById(postId)


        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const likeOrDislike = await this.queryLikeRepository.getLike(userId, postId, 'Post')

        if (!likeOrDislike) {
            await this.likeService.createLike(postId, likeStatus.likeStatus, userId, target);
        } else if (likeStatus.likeStatus === likeOrDislike.type) {
            await this.likeService.changeLikeStatus(postId, 'None', userId, target);
        } else {
            await this.likeService.changeLikeStatus(postId, likeStatus.likeStatus, userId, target);
        }

        const updated = await this.postService.getPostById(postId, userId);
        if (!updated) {
            throw new NotFoundException('Post not found');
        }
        return updated;

    }




}