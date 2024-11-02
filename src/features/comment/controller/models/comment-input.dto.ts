import {Trim} from "../../../../common/decorators/trim";
import {IsString, Length} from "class-validator";
import {likeStatusType} from "../../../../common/types/common.types";

export class CommentDto {
    @Trim()
    @IsString()
    @Length(20, 300)
    readonly content: string
}

export class CommentLikeStatusDto {
    @Trim()
    @IsString()
    readonly likeStatus: likeStatusType
}