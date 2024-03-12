import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import {UserRepository} from "../../user/repositories/user.repository";


@Injectable()
export class UniqueEmailValidationPipe implements PipeTransform {
    constructor(private userRepository: UserRepository) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body' || !value || !value.email) {
            return value;
        }

        console.log('in the email validator ' + value.email);

        if (!this.userRepository) {
            // Handle the case when userQueryRepository is undefined
            throw new BadRequestException({
                errorsMessages: [{ message: 'User query repository is not available', field: 'userQueryRepository' }],
            });
        }

        const userEmail = await this.userRepository.findUserByLoginOrEmail(value.email);

        if (userEmail) {
            throw new BadRequestException({
                errorsMessages: [{ message: 'email already exists', field: 'email' }],
            });
        }

        const userLogin = await this.userRepository.findUserByLoginOrEmail(value.login);

        if (userLogin) {
            throw new BadRequestException({
                errorsMessages: [{ message: 'login already exists', field: 'login' }],
            });
        }

        return value;
    }

}