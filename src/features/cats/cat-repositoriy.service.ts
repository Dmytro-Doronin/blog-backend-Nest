import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
// import { Cat } from './interfaces/cat.interface';
import {InjectModel} from "@nestjs/mongoose";
import {Cat} from "./domain/cat.entity";
// import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsRepository {
    constructor(
        // @Inject('CAT_MODEL')
        // private catModel: Model<Cat>,
        @InjectModel(Cat.name) private catModel: Model<Cat>
    ) {}

    async create(createCatDto: any): Promise<Cat> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }


    async findAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }
}