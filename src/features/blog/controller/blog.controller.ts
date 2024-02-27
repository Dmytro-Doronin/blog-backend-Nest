import {Body, Controller, Get, Post, Query, ValidationPipe} from "@nestjs/common";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {BlogQueryRepository} from "../repositories/blog.query-repository";
import {BlogService} from "../services/blog.service";
import {CreateBolgDto} from "./models/create-blog.dto";

@Controller('/blogs')
export class BlogController {
    blogService: BlogService;
    constructor(
        blogService: BlogService,
        private readonly blogsQueryRepository: BlogQueryRepository,
    ) {
        this.blogService = blogService
    }
    @Get()
    async getAllBlogs (
        @Query('searchNameTerm') searchNameTerm: string,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber', NumberPipes) pageNumber: number,
        @Query('pageSize', NumberPipes) pageSize: number,
    ) {
        const sortData = {
            searchNameTerm: searchNameTerm,
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        const blogs = await this.blogsQueryRepository.getAllBlogInDb(sortData)

        return blogs

    }

    @Post()
    async createNewBlogController(@Body(new ValidationPipe()) createBlogDto: CreateBolgDto) {

        const result = await this.blogService.createBlogService({
            name: createBlogDto.name,
            description: createBlogDto.description,
            websiteUrl: createBlogDto.websiteUrl
        })


    }

}