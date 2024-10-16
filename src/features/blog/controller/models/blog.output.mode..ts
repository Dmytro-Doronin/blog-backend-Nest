import {BlogDocument} from "../../domain/blog.entity";

export class BlogOutputModel {
    id:	string
    name: string
    description: string
    websiteUrl:	string
    createdAt: string
    userId: string
    isMembership: boolean
}

export class BlogFinalOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogOutputModel[]
}

export const BlogOutputModelMapper = (blog: BlogDocument): BlogOutputModel => {
    const outputModel = new BlogOutputModel();

    outputModel.id = blog.id;
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.userId = blog.userId;
    outputModel.isMembership = blog.isMembership;


    return outputModel;
};