import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import {GrpcMethod, RpcException} from "@nestjs/microservices";
import {CreateUserDTO, FindUserDTO, FollowUserDTO, UserIsFollowDTO} from "./dtos";
import { Users } from "./entities";
import {USER_ID_NOT_FOUND, USER_SERVICE, USER_SERVICE_METHODS} from "./constants/user.constants";
import { UserService } from "./user.service";
import { IncorrectEmailError, ShortPasswordError, UserAlredyExist } from "./constants";

@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.CREATE_USER) 
    async createUser(data: CreateUserDTO): Promise<Users> {
        if(data.password.length < 6) throw ShortPasswordError
        if(!data.email.split("@")[1] || !data.email.split(".")[1]) throw IncorrectEmailError

        const existUser = await this.userService.findOne({email: data.email})

        if(!!existUser.email) throw UserAlredyExist
        else {
            return 
        }
    }
    
    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USER)
    async findOne(data: FindUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Users> {
        const user = await this.userService.findOne(data.criteria, {relations: data.fields})

        return user
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.USER_IS_FOLLOW)
    async userIsFollow(data: UserIsFollowDTO): Promise<boolean> {
        if(data.owner_id) {
            const user = await this.userService.findOne({id: data.owner_id}, {relations: {subscriptions: true}})

            if(data.users_ids.length) {
                const respond = new Map<string, boolean>()
                user.subscriptions.forEach(subsc => respond.set(subsc.id, data.users_ids.indexOf(subsc.id) !== -1))

                return respond
            }
            if(data.user_id) {
                return !!user.subscriptions.find(subs => subs.id === data.user_id)
            }

        } else throw USER_ID_NOT_FOUND
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FOLLOW_USER)
    async followUser(data: FollowUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{isFollow: boolean}>  {
        const isFollow = await this.userService.findOne({id: data.follower_id, subscriptions: {id: data.user_id}}, {relations: {subscriptions: true}})

        if(isFollow) {
            await this.userService.removeSubscription(data.user_id, data.follower_id)
        } else {
            await this.userService.addSubscription(data.user_id, data.follower_id)
        }
        return {isFollow: !isFollow}
    }
}