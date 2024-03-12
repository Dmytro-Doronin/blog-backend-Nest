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
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

    constructor(@Inject(UserRepository) private userRepository: UserRepository ) {}

    async validate(userName: any, args: ValidationArguments) {

        const userEmail = await this.userRepository.findUserByLoginOrEmail(userName);

        if (userEmail) {
            return false
        }

        return true

    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}