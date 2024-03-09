import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
    @Prop({ required: true })
    id: string
    @Prop({ ref: 'User', required: true })
    userId: string
    @Prop({  required: true })
    login: string
    @Prop({  required: true })
    targetId: string
    @Prop({  enum: ['Comment', 'Post'], required: true })
    target: string
    @Prop({  required: true, default: (new Date().toISOString()) })
    addedAt: string
    @Prop({ enum: ['Like', 'Dislike', 'None'], required: true })
    type: 'Like'| 'Dislike' | 'None'

    static create({
      id,
      userId,
      login,
      targetId,
      target,
      addedAt,
      type
    }: Like
    ) {
        const like = new Like()
        like.id = id
        like.userId = userId
        like.login = login
        like.targetId = targetId
        like.target = target
        like.addedAt = addedAt
        like.type = type
        return like
    }
}
export const LikeSchema = SchemaFactory.createForClass(Like);
