import {Injectable, OnModuleInit} from "@nestjs/common";
import {Client, ClientGrpc, Transport} from "@nestjs/microservices";
import {AddLikeDTO, Like, LikesServiceClient} from "src/proto/likes";
import {LIKES_MODULE_CONFIG} from "../app.constants";

@Injectable()
export class LikesClient implements OnModuleInit {

    @Client({
        transport: Transport.GRPC,
        options: {
            url: LIKES_MODULE_CONFIG.HOST,
            package: LIKES_MODULE_CONFIG.PACKAGE,
            protoPath: LIKES_MODULE_CONFIG.PROTO,
            loader: {
                keepCase: true
            }
        }
    })
    client: ClientGrpc

    private likesService: LikesServiceClient;

    onModuleInit(): any {
        this.likesService = this.client.getService<LikesServiceClient>(LIKES_MODULE_CONFIG.SERVICE)
    }

    addLike(data: AddLikeDTO): Promise<Like> {
        return this.likesService.addLike(data).toPromise()
    }
}