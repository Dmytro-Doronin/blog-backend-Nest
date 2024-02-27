import { Module } from '@nestjs/common';
import { CatsController } from './controller/cat.controller';
import { CatsRepository } from './cat-repositoriy.service';
import { catsProviders } from '../../database/models/cats.providers';
import { DatabaseModule } from '../../database/database.module';
import {MongooseModule} from "@nestjs/mongoose";
import {appSettings} from "../../settings/app-settings";
import {Cat, UserSchema} from "./domain/cat.entity";

@Module({
    imports: [MongooseModule.forFeature([{ name: Cat.name, schema: UserSchema }])],
    controllers: [CatsController],
    providers: [
        CatsRepository,
        // ...catsProviders,
    ],
})
export class CatsModule {}