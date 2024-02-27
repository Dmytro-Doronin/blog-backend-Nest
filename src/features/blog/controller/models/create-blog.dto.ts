import {IsString, IsInt, Length, IsEmail, Matches, IsUrl} from 'class-validator';
import {Trim} from "../../../../common/decorators/trim";

export class CreateBolgDto {

    @Trim()
    @IsString()
    @Length(1, 15)
    readonly name: string;

    @Trim()
    @IsString()
    @Length(1, 500)
    readonly description: string;

    @Trim()
    @IsString()
    @Length(1, 100)
    @IsUrl({}, { message: 'Неверный формат URL' })
    readonly websiteUrl: string

}