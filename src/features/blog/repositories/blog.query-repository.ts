import {QueryBlogInputModel} from "../../../common/types/common.types";
import {InjectModel} from "@nestjs/mongoose";
import {Blogs} from "../domain/blog.entity";
import {Model} from "mongoose";
import {BlogFinalOutputModel, BlogOutputModelMapper} from "../controller/models/blog.output.mode.";
import {filterForSort} from "../../../common/utils/filterForSort";

export class BlogQueryRepository {

    constructor(@InjectModel(Blogs.name) private BlogModel: Model<Blogs>) {}

    async getAllBlogInDb (sortData: QueryBlogInputModel): Promise<BlogFinalOutputModel>{
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection  = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {$regex: searchNameTerm, $options: 'i'}
            }
        }
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
}