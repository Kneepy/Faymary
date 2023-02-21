import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";
import { Likes } from "./common";

@Injectable()
export class Broker implements NestInterceptor {

    // иначе grpc не воспринимает промисы, что вполне логично, поэтому юзаем ко всему что передаёт данные клиентам в промисах
    intercept(context: ExecutionContext, next: CallHandler<Likes>): Observable<any> {
        const ctx = context.switchToRpc().getData()
        console.log(ctx)
        //console.log(next.handle().pipe(map(async data => console.log(await data))))
        return next.handle().pipe(map(async data => (
            {
                id: 'b5557734-ecad-4d49-a9fd-34bb6f4da7ab',
                type: 0,
                item_id: '231313',
                user_id: '1234',
                createdAt: '1676976758334',
                state: 1
            }
        )))
    }
}