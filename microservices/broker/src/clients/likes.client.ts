import {Injectable, OnModuleInit} from "@nestjs/common";
import {Client, ClientGrpc} from "@nestjs/microservices";
import {AddLikeDTO, Like, LikesServiceClient} from "src/proto/likes";
import {getClientOptionsByConfig, LIKES_MODULE_CONFIG} from "../app.constants";

@Injectable()
export class LikesClient implements OnModuleInit {

    @Client(getClientOptionsByConfig(LIKES_MODULE_CONFIG))
    client: ClientGrpc

    private likesService: LikesServiceClient;

    onModuleInit(): any {
        this.likesService = this.client.getService<LikesServiceClient>(LIKES_MODULE_CONFIG.SERVICE)
    }

    addLike(data: AddLikeDTO): Promise<Like> {
        return this.likesService.addLike(data).toPromise()
    }
}