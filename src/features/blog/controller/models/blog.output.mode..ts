import {BlogDocument} from "../../domain/blog.entity";

export class UserOutputModel {
    id:	string
    name: string
    description: string
    websiteUrl:	string
    createdAt: string
    isMembership: boolean
}

export const BlogOutputModelMapper = (blog: BlogDocument): UserOutputModel => {
    const outputModel = new UserOutputModel();

    outputModel.id = blog.id;
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.isMembership = blog.isMembership;


    return outputModel;
};