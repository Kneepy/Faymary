import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req: Request = ctx.switchToHttp().getRequest();
        //req.headers.authorization
    },
);
