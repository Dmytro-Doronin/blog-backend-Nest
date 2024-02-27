import {Controller, Get, Query} from "@nestjs/common";
import {NumberPipes} from "../../../common/pipes/number.pipe";

@Controller('blogs')
export class BlogController {

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

        const blogs = await

    }

}