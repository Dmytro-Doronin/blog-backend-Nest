import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type PostDocument = HydratedDocument<Posts>;

@Schema()
export class Posts {
    @Prop({required: true})
    id: string;

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    shortDescription: string;

    @Prop({required: true})
    content: string

    @Prop({required: true})
    blogId: string

    @Prop({required: true})
    blogName: string

    @Prop({required: true})
    createdAt: string

    @Prop({required: true})
    userId: string

    @Prop({required: true})
    userName: string

    @Prop({required: true})
    imageUrl: string

    static create(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string,
        userId: string,
        userName: string,
        imageUrl: string
    ) {
        const post = new Posts();
        post.id = id;
        post.title = title;
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId
        post.blogName = blogName
        post.createdAt = createdAt
        post.userId = userId
        post.userName = userName
        post.imageUrl = imageUrl
        return post;
    }
}

export const PostSchema = SchemaFactory.createForClass(Posts);