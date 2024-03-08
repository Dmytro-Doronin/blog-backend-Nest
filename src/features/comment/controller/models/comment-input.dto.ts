import {Trim} from "../../../../common/decorators/trim";
import {IsEmail, IsString, Length} from "class-validator";

export class CommentDto {
    @Trim()
    @IsString()
    @Length(20, 300)
    readonly content: string
}