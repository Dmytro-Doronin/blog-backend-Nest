import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class NumberPipes implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const num = Number(value)


        return num
    }
}