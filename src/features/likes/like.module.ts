import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Like, LikeSchema} from "./domain/like.entity";
import {LikeRepository} from "./repositories/like.repository";


@Module({
    imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),],
    controllers: [],
    providers: [LikeRepository],
    exports: [LikeRepository]
})

export class LikeModule {}