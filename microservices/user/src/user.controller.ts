import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { FindUserDTO, FollowUserDTO } from "./dtos";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(
        private userResource: UserService
    ) {}

    @GrpcMethod("UserService", "FindOne")
    async findOne(data: FindUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>) {
        const user = await this.userResource.findOne(data)

        return user
    }

    @GrpcMethod("UserService", "FollowUser")
    async followUser(data: FollowUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>) {
        
    }
}