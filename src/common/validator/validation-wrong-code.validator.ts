import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments, validate,
} from 'class-validator';
import {UserRepository} from "../../features/user/repositories/user.repository";
import {Inject} from "@nestjs/common";

//registration in IoC
@ValidatorConstraint({ async: true })
export class WrongConfirmationCodeConstraint implements ValidatorConstraintInterface {

    constructor(@Inject(UserRepository) private userRepository: UserRepository ) {}

    async validate(code: any, args: ValidationArguments) {

        const user = await this.userRepository.getUserByConfirmationCode(code);

        if (!user) {
            return false
        }

        if (user.emailConfirmation.isConfirmed) {
            return false
        }

        return true

    }
}

export function WrongConfirmationCode(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: WrongConfirmationCodeConstraint,
        });
    };
}