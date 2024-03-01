import {Controller, NotFoundException, Param} from "@nestjs/common";
import {CommentQueryRepository} from "../repositories/comment.query-repository";

@Controller('/comments')
export class CommentController {

    constructor(private readonly commentQueryRepository: CommentQueryRepository) {}

    async getCommentByIdController (@Param('id') commentId: string) {
        const userId = '' // need to add

        const comment = await this.commentQueryRepository.getCommentById(commentId, userId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return comment
    }

}