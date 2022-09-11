import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import * as url from "url";
import { Observable } from "rxjs";
import { FilesService, UsersService } from "src/mysql";
import { ICustomRequest } from "src/common";

@Injectable()
export class WriteFileInterceptor implements NestInterceptor {
    constructor(
        private filesService: FilesService,
        private usersServive: UsersService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<ICustomRequest>();
        const user = await this.usersServive.findOne({ id: req.user.userId });
        const getPath = file =>
            url.format({
                protocol: req.protocol,
                host: req.get("host"),
                pathname: file.filename
            });

        if (req.file) {
            req.file.savedAs = await this.filesService.create({
                path: getPath(req.file),
                user
            });
        }
        if (req.files) {
            req.files = await Promise.all(
                req.files.map(async file =>
                    Object.assign(file, {
                        savedAs: await this.filesService.create({
                            path: getPath(file),
                            user
                        })
                    })
                )
            );
        }

        return next.handle();
    }
}
