import {BlogDocument} from "../../domain/blog.entity";

export class BlogOutputModel {
    id:	string
    name: string
    description: string
    websiteUrl:	string
    createdAt: string
    userId: string
    userName: string
    isMembership: boolean
    imageUrl: string
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
    outputModel.userName = blog.userName
    outputModel.isMembership = blog.isMembership;
    outputModel.imageUrl = blog.imageUrl;



    return outputModel;
};