import {Trim} from "../../../../common/decorators/trim";
import {IsEmail, IsString, IsUrl, Length} from "class-validator";

export class AuthInputDto {

    @Trim()
    @IsString()
    @Length(3, 10)
    readonly login: string;

    @Trim()
    @IsString()
    @Length(6, 20)
    readonly password: string;

    @Trim()
    @IsString()
    @Length(1, 100)
    @IsEmail()
    readonly email: string
}

export class ConfirmationInputDto {

    @Trim()
    @IsString()
    @Length(1, 100)
    readonly code: string
}

export class EmailResendingDto {
    @Trim()
    @IsString()
    @Length(1, 100)
    @IsEmail()
    readonly email: string
}
