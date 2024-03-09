import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query, UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {CreateUserDto} from "./models/create-user.dto";
import {UserService} from "../service/user.service";
import {NumberPipes} from "../../../common/pipes/number.pipe";
import {QueryUserInputModel} from "../../../common/types/common.types";
import {UserQueryRepository} from "../repositories/user.query-repository";
import {UserOutputModelWithPagination} from "./models/user.output-model";
import {BasicAuthGuard} from "../../auth/guards/basic-auth.guard";


@Controller('/users')
export class UserController {

    userService: UserService

    constructor(
        userService: UserService,
        private userQueryRepository: UserQueryRepository
    ) {
        this.userService = userService
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllUsers (
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: "asc" | "desc",
        @Query('pageNumber') pageNumber: string,
        @Query('pageSize') pageSize: string,
        @Query('searchLoginTerm') searchLoginTerm: string,
        @Query('searchEmailTerm') searchEmailTerm: string,
    ) {
        const sortData: QueryUserInputModel = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchLoginTerm: searchLoginTerm,
            searchEmailTerm: searchEmailTerm
        }

        const users: UserOutputModelWithPagination = await this.userQueryRepository.getAllUser(sortData)

        return users

    }


    @UseGuards(BasicAuthGuard)
    @Post()
    async createUser (@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        const user = await this.userService.createUser({
            login: createUserDto.login,
            email: createUserDto.email,
            password: createUserDto.password
        })

        if (!user) {
            throw new NotFoundException('User was not create')
        }

        return user
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete('/:id')
    async deleteUserById (@Param('id') userId: string) {
        const result = await this.userService.deleteUserById(userId)

        if (!result) {
            throw new NotFoundException('User was not deleted')
        }
    }

}