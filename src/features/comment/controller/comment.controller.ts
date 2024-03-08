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
import {CommentDto} from "./models/comment-input.dto";
import {Response} from "express";

@Controller('/comments')
export class CommentController {

    constructor(
        private readonly commentQueryRepository: CommentQueryRepository,
        private readonly commentService: CommentService
    ) {}

    @Get('/:id')
    async getCommentByIdController (@Param('id') commentId: string) {
        const userId = '' // need to add

        const comment = await this.commentService.getCommentByIdService(commentId, userId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return comment
    }


    @UseGuards(JwtAuthGuard)
    @Put('/:commentId ')
    async changeCommentById(
        @Request() req,
        @Res() res: Response,
        @Param('commentId') commentId: string,
        @Body(new ValidationPipe()) commentDto: CommentDto
    ) {
        const currentUserId = req.userId
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
        const currentUserId = req.userId
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


}