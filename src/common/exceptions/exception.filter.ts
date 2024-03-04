import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {Response, Request} from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        if (status === 400) {
            const errorResponse = {
                errors: [] as any[]
            }

            const responseBody: any = exception.getResponse()

            if (Array.isArray(responseBody.message)) {
                responseBody.message.forEach((m) => {
                    errorResponse.errors.push(m);
                });
            } else if (typeof responseBody.message === 'string') {
                errorResponse.errors.push(responseBody.message);
            }

            response.status(status).json(errorResponse);
        } else {
            response.status(status).json({
                statusCode: status,
                path: request.url
            })
        }
    }
}
