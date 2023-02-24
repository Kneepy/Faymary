import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import * as url from "url";
import { Observable } from "rxjs";
import { FilesService, UsersService } from "src/mysql";
import { ICustomFile, ICustomRequest } from "src/common";
import * as path from "path";
import { Files } from "src/entity";

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
        const getFileObject = (file: ICustomFile) => ({
            path: url.format({
                protocol: req.protocol,
                host: req.get("host"),
                pathname: file.filename
            }),
            user, filename: file.filename.split(".")[0],
            extname: path.extname(file.filename)
        }) as Files
            
        if (req.file) {
            req.file.savedAs = await this.filesService.create(getFileObject(req.file));
        }
        if (req.files) {
            req.files = await Promise.all(
                req.files.map(async file =>
                    Object.assign(file, {
                        savedAs: await this.filesService.create(getFileObject(file))
                    })
                )
            );
        }

        return next.handle();
    }
}
