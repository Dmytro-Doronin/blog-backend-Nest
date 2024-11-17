import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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


@Controller('/users')
export class UserController {

    userService: UserService

    constructor(
        userService: UserService,
        private userQueryRepository: UserQueryRepository
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
                        await s3
                            .deleteObject({
                                Bucket: process.env.AWS_BUCKET_NAME as string,
                                Key: oldKey,
                            })
                            .promise();
                    } catch (error) {
                        console.error(`Cannot delete old img: ${error.message}`);
                    }
                }
            }

            const uploadResult = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET_NAME as string,
                    Key: `blogs/${Date.now()}_${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                })
                .promise();

            imageUrl = uploadResult.Location;
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