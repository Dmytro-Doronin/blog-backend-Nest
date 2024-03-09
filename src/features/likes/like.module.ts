import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Like, LikeSchema} from "./domain/like.entity";
import {LikeRepository} from "./repositories/like.repository";
import {QueryLikeRepository} from "./repositories/query-like.repository";
import {UserModule} from "../user/user.module";
import {LikeService} from "./service/like.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]), UserModule],
    controllers: [],
    providers: [LikeRepository, QueryLikeRepository, LikeService],
    exports: [LikeRepository, QueryLikeRepository, LikeService]
})

export class LikeModule {}