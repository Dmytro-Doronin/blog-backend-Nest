import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";


export type CommentDocument = HydratedDocument<Comment>

@Schema()
export class Comment {
    @Prop({type: String, required: true})
    id: string
    @Prop({type: String, required: true})
    postId: string
    @Prop({type: String, required: true})
    content: string
    @Prop({
        type: {
            userId: { type: String, required: true },
            userLogin: { type: String, required: true },
            userImageUrl: { type: String, required: false, default: '' },
        },
        required: true,
    })
    commentatorInfo: { userId: string; userLogin: string, userImageUrl: string };
    @Prop({type: String, required: true})
    createdAt: string

    static create (
        id: string,
        postId: string,
        content: string,
        commentatorInfo : {userId: string, userLogin: string, userImageUrl: string},
        createdAt: string,
        ) {

        const comment = new Comment();
        comment.id = id;
        comment.postId = postId;
        comment.content = content;
        comment.commentatorInfo = {
            userId: commentatorInfo.userId,
            userLogin: commentatorInfo.userLogin,
            userImageUrl: commentatorInfo.userImageUrl
        };
        comment.createdAt = createdAt;

        return comment
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment)