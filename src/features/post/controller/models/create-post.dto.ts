import {Trim} from "../../../../common/decorators/trim";
import {IsString, Length} from "class-validator";
import {likeStatusType} from "../../../../common/types/common.types";

export class CreatePostDto {

    @Trim()
    @IsString()
    @Length(1, 30)
    readonly title: string;

    @Trim()
    @IsString()
    @Length(1, 100)
    readonly shortDescription: string;

    @Trim()
    @IsString()
    @Length(1, 1000)
    readonly content: string

    @Trim()
    @IsString()
    @Length(1, 100)
    readonly blogId: string

}

export class CreateCommentsForDto {

    @Trim()
    @IsString()
    @Length(20, 300)
    readonly content: string

}

export class LikeStatusDto {
    @Trim()
    @IsString()
    readonly likeStatus: likeStatusType

}