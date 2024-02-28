import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
    @Prop({required: true})
    id: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    websiteUrl: string

    @Prop({required: true})
    createdAt: string

    @Prop({required: true})
    isMembership: boolean

    static create(id: string, name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean) {
        const blog = new Blog();
        blog.id = id;
        blog.name = name;
        blog.description = description
        blog.websiteUrl = websiteUrl
        blog.createdAt = createdAt
        blog.isMembership = isMembership
        return blog;
    }
}

export const BlogsSchema = SchemaFactory.createForClass(Blog);