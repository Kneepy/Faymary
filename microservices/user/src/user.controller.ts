import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { FindUserDTO, FollowUserDTO } from "./dtos";
import { Users } from "./entities";
import { USER_SERVICE, USER_SERVICE_METHODS } from "./user.constants";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USER)
    async findOne(data: FindUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Users> {
        const user = await this.userService.findOne(data)

        return user
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FOLLOW_USER)
    async followUser(data: FollowUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<void>  {
        const isFollow = await this.userService.findOne({id: data.follower_id, subscriptions: {id: data.user_id}}, {relations: {subscriptions: true}})

        if(isFollow) {
            await this.userService.removeSubscription(data.user_id, data.follower_id)
        } else {
            await this.userService.addSubscription(data.user_id, data.follower_id)
        }
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.GET_FOLLOWERS)
    async getFollowers() {}

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.GET_SUBSCRIPTIONS)
    async getSubscriptions() {}
}