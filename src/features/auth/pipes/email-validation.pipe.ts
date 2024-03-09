import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import {UserRepository} from "../../user/repositories/user.repository";


@Injectable()
export class UniqueEmailValidationPipe implements PipeTransform {
    constructor(private userRepository: UserRepository) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body' || !value || !value.email) {
            return value;
        }

        const userEmail = await this.userRepository.findUserByLoginOrEmail(value.email);

        if (userEmail) {
            throw new BadRequestException('Email already exists');
        }

        return value;
    }
}