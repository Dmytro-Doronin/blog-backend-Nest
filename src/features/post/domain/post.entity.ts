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

    static create(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string
    ) {
        const post = new Posts();
        post.id = id;
        post.title = title;
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId
        post.blogName = blogName
        post.createdAt = createdAt

        return post;
    }
}

export const PostSchema = SchemaFactory.createForClass(Posts);