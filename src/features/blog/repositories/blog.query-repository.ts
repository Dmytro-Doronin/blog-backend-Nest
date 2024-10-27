import {QueryBlogInputModel} from "../../../common/types/common.types";
import {InjectModel} from "@nestjs/mongoose";
import {Blog} from "../domain/blog.entity";
import {Model} from "mongoose";
import {BlogFinalOutputModel, BlogOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";
import {filterForSort} from "../../../common/utils/filterForSort";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BlogQueryRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: Model<Blog>) {}

    async getAllBlogInDb (sortData: QueryBlogInputModel, userId?: string): Promise<BlogFinalOutputModel>{
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection  = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter: any = {
            ...(searchNameTerm && { name: { $regex: searchNameTerm, $options: 'i' } }),
            ...(userId && { userId }),
        };

        // if (searchNameTerm) {
        //     filter = {
        //         name: {$regex: searchNameTerm, $options: 'i'}
        //     }
        // }
        //
        // if (userId) {
        //
        // }

        try {
            const blogs = await this.BlogModel
                .find(filter)
                .sort(filterForSort(sortBy, sortDirection))
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean()

            const totalCount = await this.BlogModel.countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / +pageSize)


            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: blogs.map(BlogOutputModelMapper)
            }
        } catch (e) {
            throw new Error('Does not get all blogs')
        }

    }

    // async getAllBlogForCurrentUserInDb (sortData: QueryBlogInputModel, userId: string): Promise<BlogFinalOutputModel>{
    //     const searchNameTerm = sortData.searchNameTerm ?? null
    //     const sortBy = sortData.sortBy ?? 'createdAt'
    //     const sortDirection  = sortData.sortDirection ?? 'desc'
    //     const pageNumber = sortData.pageNumber ?? 1
    //     const pageSize = sortData.pageSize ?? 10
    //
    //     let filter = {}
    //
    //     if (searchNameTerm) {
    //         filter = {
    //             name: {$regex: searchNameTerm, $options: 'i'}
    //         }
    //     }
    //     try {
    //         const blogs = await this.BlogModel
    //             .find(filter)
    //             .sort(filterForSort(sortBy, sortDirection))
    //             .skip((+pageNumber - 1) * +pageSize)
    //             .limit(+pageSize)
    //             .lean()
    //
    //         const totalCount = await this.BlogModel.countDocuments(filter)
    //
    //         const pagesCount = Math.ceil(totalCount / +pageSize)
    //
    //
    //         return {
    //             pagesCount,
    //             page: +pageNumber,
    //             pageSize: +pageSize,
    //             totalCount,
    //             items: blogs.map(BlogOutputModelMapper)
    //         }
    //     } catch (e) {
    //         throw new Error('Does not get all blogs')
    //     }
    //
    // }


    async getBlogByIdInDb (id: string): Promise<BlogOutputModel | null>  {

        try {
            const blog = await this.BlogModel.findOne({id: id})
            if (!blog) {
                return null
            }
            return BlogOutputModelMapper(blog)
        } catch (e) {
            throw new Error('Blog was not found')
        }
    }

}