import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { CreateFileDAO, ICustomFile, ICustomRequest } from "src/types";
import * as path from "path"
import { StoreResource } from "src/providers";

@Injectable()
export class WriteFileInterceptor implements NestInterceptor {
    constructor(
        private storeResourse: StoreResource
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest<ICustomRequest>()
        const user = req.headers.authorization
        const getFileObject = (file: ICustomFile): CreateFileDAO => ({
            user_id: user, filename: file.filename.split(".")[0],
            extname: path.extname(file.filename)
        })

        if(req.file) {
            req.file.savedAs = await this.storeResourse.create(getFileObject(req.file))
        }
        if(req.files) {
            req.files = await Promise.all(req.files.map(async file => Object.assign(file, {savedAs: await this.storeResourse.create(getFileObject(file))})))
        }

        return next.handle()
    }
}