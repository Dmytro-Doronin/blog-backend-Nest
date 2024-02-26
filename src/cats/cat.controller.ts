import {Body, Controller, Get, Injectable, Post} from "@nestjs/common";
import {CatsRepository} from "./cat-repositoriy.service";
import {CatType} from "./types/cat.type";


@Controller('cats')
export class CatsController {

    constructor(private readonly catsRepository: CatsRepository) {}

    @Get()
    async getAllCatController () {
        return await this.catsRepository.findAll()
    }

    @Post()
    async createCatController (@Body() catData : CatType) {
        return await this.catsRepository.create(catData)
    }

}