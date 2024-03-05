import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        if (!request.user?.id) throw new Error('Jwt wrong')
        return request.user.id
    }
)