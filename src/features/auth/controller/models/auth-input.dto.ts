import {Trim} from "../../../../common/decorators/trim";
import {IsEmail, IsString, IsUrl, Length, MaxLength, MinLength} from "class-validator";
import {
    IsUserAlreadyExist
} from "../../../../common/validator/validation-login-password.validator";
import {WrongConfirmationCode} from "../../../../common/validator/validation-wrong-code.validator";
import {IsEmailConfirmed} from "../../../../common/validator/validation-email-confirmation.validator";

export class AuthInputDto {

    @Trim()
    @IsString()
    @Length(3, 10)
    @IsUserAlreadyExist({
        message: 'User already exists. Choose another name.',
    })
    readonly login: string;

    @Trim()
    @IsString()
    @Length(6, 20)
    readonly password: string;

    @Trim()
    @IsString()
    @Length(1, 100)
    @IsEmail()
    @IsUserAlreadyExist({
        message: 'Email already exists. Choose another email.',
    })
    readonly email: string
}

export class ConfirmationInputDto {

    @Trim()
    @IsString()
    @Length(1, 100)
    @WrongConfirmationCode({
        message: 'Code already confirmed'
    })
    readonly code: string
}

export class EmailDto {
    @Trim()
    @IsString()
    @Length(1, 100)
    @IsEmail()
    @IsEmailConfirmed({
        message: 'Email already confirmed'
    })

    readonly email: string
}

export class NewPasswordDto {
    @Trim()
    @IsString()
    @Length(6, 20)
    readonly newPassword: string;

    @Trim()
    @IsString()
    @Length(1, 100)
    readonly recoveryCode: string
}

export class AccessTokenDto {
    @Trim()
    @IsString()
    @Length(1)
    readonly accessToken: string
}