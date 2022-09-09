import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ICustomRequest } from "src/common";
import { FilesService, UsersService } from "src/mysql";

@Injectable()
export class WriteFileInterceptor implements NestInterceptor {
    constructor(
        private filesService: FilesService,
        private usersServive: UsersService
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest<ICustomRequest>()
        const user = await this.usersServive.findOne({id: req.user.userId})
        
        if(req.file) {

        }

        return next.handle()
    }
}