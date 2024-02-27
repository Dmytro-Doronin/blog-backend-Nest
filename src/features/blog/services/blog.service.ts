import {Injectable} from "@nestjs/common";
import {CreateBolgDto} from "../controller/models/create-blog.dto";

@Injectable()
export class BlogService {


    async createBlogService({name, description, websiteUrl} : CreateBolgDto) {

    }
}