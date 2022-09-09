import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import * as path from "path";
import * as url from "url"
import { Observable } from "rxjs";
import { ICustomRequest } from "src/common";
import { ConfigService } from "src/config";
import { FilesService, UsersService } from "src/mysql";

@Injectable()
export class WriteFileInterceptor implements NestInterceptor {
    constructor(
        private filesService: FilesService,
        private usersServive: UsersService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest()
        const user = await this.usersServive.findOne({id: req.user.userId})
        const saveFile = () => {
            //await this.filesService.create({user, })
        }
        const files = []

        if(req.file) {

        }
        if(req.files) {
            req.files.forEach((file) => {
                files.push(url.format({
                    protocol: req.protocol,
                    host: req.get("host"),
                    pathname: file.filename
                }))
            })
        }

        return next.handle()
    }
}