import { CallHandler, ExecutionContext, Inject, mixin, NestInterceptor, Type } from "@nestjs/common";
import { Observable } from "rxjs";
import { CreateFileDAO, ICustomFile, ICustomRequest } from "src/types";
import * as path from "path"
import { StoreResource } from "src/providers";

export const WriteFileInterceptor = (field: string, multiply: boolean): Type<NestInterceptor> => {
    class WriteFileInterceptorMixin implements NestInterceptor {
        constructor(
            @Inject(StoreResource) private storeResourse: StoreResource
        ) {}
    
        async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
            const ctx = context.switchToHttp()
            const req = ctx.getRequest<ICustomRequest>()
            const user = req.query.user_id as string
            const getFileObject = (file: Express.Multer.File): CreateFileDAO => ({
                user_id: user, filename: file.filename.split(".")[0],
                extname: path.extname(file.filename)
            })

            if(multiply) {            
                req[field] = await Promise.all(req[field].map(async (file: Express.Multer.File) => Object.assign(file, {savedAs: await this.storeResourse.create(getFileObject(file))})))
            }
            else {
                req[field].savedAs = await this.storeResourse.create(getFileObject(req[field]))
            }
    
            return next.handle()
        }
    }

    return mixin(WriteFileInterceptorMixin)
}