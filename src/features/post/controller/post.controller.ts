import {Controller, Post} from "@nestjs/common";

@Controller()
export class PostController {

    @Post()
    async createPost () {
        return "Say hi"
    }

}