import { RpcException } from '@nestjs/microservices';
import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: RpcException, ctx: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost
        const http = ctx.switchToHttp()
        const exceptionBody = {message: exception.message, status: 401}

        httpAdapter.reply(http.getResponse(), exceptionBody, exceptionBody.status)
    }
}