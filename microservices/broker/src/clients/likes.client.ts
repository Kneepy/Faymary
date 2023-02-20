import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {LIKES_MODULE, LIKES_SERVICE} from "../app.constants";
import {AddLikeDTO, Like, LikesServiceClient} from "src/proto/likes";
import {Observable} from "rxjs";

@Injectable()
export class LikesClient implements OnModuleInit {
    constructor(@Inject(LIKES_MODULE) private client: ClientGrpc) {}

    private likesService: LikesServiceClient;

    onModuleInit(): any {
        this.likesService = this.client.getService<LikesServiceClient>(LIKES_SERVICE)
    }

    addLike(data: AddLikeDTO): Observable<Like> {
        const a = this.likesService.addLike(data)
        a.toPromise().then(el => console.log(el))
        return a
    }
}