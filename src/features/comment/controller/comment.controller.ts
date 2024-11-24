import {
    Body,
    Controller, Delete, ForbiddenException,
    Get, HttpException, HttpStatus,
    NotFoundException,
    Param,
    Put,
    Request,
    Res,
    UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {CommentQueryRepository} from "../repositories/comment.query-repository";
import {CommentService} from "../service/comment.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CommentDto, CommentLikeStatusDto} from "./models/comment-input.dto";
import {Response} from "express";
import {QueryLikeRepository} from "../../likes/repositories/query-like.repository";
import {LikeService} from "../../likes/service/like.service";
import {OptionalJwtAuthGuard} from "../../auth/guards/optional-jwt-auth-guard.guard";
import {S3Service} from "../../../common/services/s3.service";

@Controller('/comments')
export class CommentController {

    constructor(
        private readonly commentQueryRepository: CommentQueryRepository,
        private readonly commentService: CommentService,
        private readonly queryLikeRepository: QueryLikeRepository,
        private readonly likeService: LikeService,
    ) {}

    @UseGuards(OptionalJwtAuthGuard)
    @Get('/:id')
    async getCommentByIdController (@Param('id') commentId: string, @Request() req) {
        const userId: string = req.user ? req.user.userId : '' // need to add

        const comment = await this.commentService.getCommentByIdService(commentId, userId)
        console.log(comment)
        if (!comment) {
            throw new NotFoundException('Comment not found')
        }
        return comment
    }


    @UseGuards(JwtAuthGuard)
    @Put('/:commentId')
    async changeCommentById(
        @Request() req,
        @Res() res: Response,
        @Param('commentId') commentId: string,
        @Body(new ValidationPipe()) commentDto: CommentDto
    ) {
        const currentUserId = req.user.userId
        const comment = await this.commentQueryRepository.getCommentById(commentId)
        if (!comment) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        if (currentUserId !== comment.commentatorInfo.userId) {
            throw new ForbiddenException();
        }

        const result = await this.commentService.changeComment(comment.id, commentDto.content)

        if (!result) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        return res.sendStatus(204)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:commentId')
    async deleteCommentById(
        @Request() req,
        @Res() res: Response,
        @Param('commentId') commentId: string,
    ) {
        const currentUserId = req.user.userId
        const comment = await this.commentQueryRepository.getCommentById(commentId)

        if (!comment) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        if (currentUserId !== comment.commentatorInfo.userId) {
            throw new ForbiddenException();
        }

        const deletedResult = await this.commentService.deleteComment(commentId)

        if (!deletedResult) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        return res.sendStatus(204)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:commentId/like-status')
    async setLikeStatusForComments (
        @Request() req,
        @Res() res: Response,
        @Param('commentId') commentId: string,
        @Body(new ValidationPipe()) likeStatus: CommentLikeStatusDto
    ) {
        const target = "Comment"
        const userId = req.user.userId
        const comment = await this.commentQueryRepository.getCommentById(commentId)
        if (!comment) {
            throw new NotFoundException()
        }

        const likeOrDislike = await this.queryLikeRepository.getLike(userId,commentId)
        console.log(likeOrDislike)
        if (!likeOrDislike) {
            await this.likeService.createLike(commentId, likeStatus.likeStatus, userId, target)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        if (likeStatus.likeStatus === likeOrDislike.type) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        const result = await this.likeService.changeLikeStatus(commentId, likeStatus.likeStatus, userId, target)
        if (!result) {
            throw new NotFoundException()
        }

        return res.sendStatus(204)
    }

}