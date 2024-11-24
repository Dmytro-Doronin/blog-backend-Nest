import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode, InternalServerErrorException,
    NotFoundException,
    Param,
    Post, Put,
    Query, Request, Res, UploadedFile, UseGuards, UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {ChangeUserDto, CreateUserDto} from "./models/create-user.dto";
import {UserService} from "../service/user.service";
import {QueryUserInputModel} from "../../../common/types/common.types";
import {UserQueryRepository} from "../repositories/user.query-repository";
import {UserOutputModelWithPagination} from "./models/user.output-model";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {s3} from "../../../../aws.config";
import {Response} from "express";
import {S3Service} from "../../../common/services/s3.service";


@Controller('/users')
export class UserController {

    userService: UserService

    constructor(
        userService: UserService,
        private userQueryRepository: UserQueryRepository,
        private readonly s3Service: S3Service,
    ) {
        this.userService = userService
    }

    // @UseGuards(BasicAuthGuard)
    // @UseGuards(OptionalJwtAuthGuard)
    @UseGuards(JwtAuthGuard)
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


    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    // @HttpCode(204)
    @Put()
    async changeUser (
        @Body(new ValidationPipe()) changeUserDto: ChangeUserDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
        @Res() res: Response,
    ) {

        const userId = req.user.userId

        const user = await this.userQueryRepository.getUserById(userId)

        if (!user) {
            throw new NotFoundException('User was not found')
        }


        let imageUrl = user.imageUrl

        if (file) {
            if (user.imageUrl) {
                let oldKey = user.imageUrl.split('.com/')[1];
                oldKey = decodeURIComponent(oldKey);

                if (oldKey) {
                    try {
                        await this.s3Service.deleteFile(oldKey)
                    } catch (error) {
                        throw new InternalServerErrorException(
                            `Failed to delete old image with key: ${oldKey}. ${error.message}`)
                    }
                }
            }

            if (file) {
                imageUrl = await this.s3Service.uploadFile(file, 'blogs');
            }
        }

        const newUser = await this.userService.changeUserData(userId, changeUserDto.login, imageUrl)

        if (!newUser) {
            throw new NotFoundException('User was not changed')
        }

        return res.status(200).send(newUser)
    }

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
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

    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete('/:id')
    async deleteUserById (@Param('id') userId: string) {
        const result = await this.userService.deleteUserById(userId)

        if (!result) {
            throw new NotFoundException('User was not deleted')
        }
    }

}