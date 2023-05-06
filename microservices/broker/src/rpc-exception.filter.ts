import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: RpcException & {status: number, auth: boolean}, ctx: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost
        const http = ctx.switchToHttp()
        const exceptionBody = {message: exception.message, status: exception.status}
    
        httpAdapter.reply(http.getResponse(), exceptionBody, exceptionBody.status)
    }
}