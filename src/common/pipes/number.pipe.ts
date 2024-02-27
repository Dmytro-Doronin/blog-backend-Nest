import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class NumberPipes implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const num = Number(value)

        if (isNaN(num)) {
            throw new BadRequestException('Not a number');
        }

        return num
    }
}