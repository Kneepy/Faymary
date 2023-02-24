import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import * as bcrypt from "bcryptjs"
import {CreateUserDTO, FindUserDTO, FindUsersDTO, FollowUserDTO, UpdateUserDTO, UserIsFollowDTO, UsersIsFollowDTO} from "./dtos";
import { Users } from "./entities";
import { USER_SERVICE, USER_SERVICE_METHODS} from "./constants/user.constants";
import { UserService } from "./user.service";
import { IncorrectEmailError, ShortPasswordError, UserAlredyExist, UserIdNotFound } from "./constants";
import { UserIsFollowInterface, UsersIsFollowsInterface } from "./interfaces";

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
            const passSalt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hashSync(data.password, passSalt)
        
            return await this.userService.create(data)
        }
    }
    
    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.UPDATE_USER)
    async updateUser(data: UpdateUserDTO): Promise<Users> {
        const user = await this.userService.findOne({id: data.id})

        if(user) {
            return await this.userService.update(Object.assign(user, data));
        } else throw UserIdNotFound
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USERS)
    async find(data: FindUsersDTO): Promise<{users: Users[]}> {
        const relations = data.addSubs ? {subscriptions: true, followers: true} : [];

        delete data.addSubs

        Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

        return {users: await this.userService.find(data, {relations})}
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USER)
    async findOne(data: FindUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Users> {
        const relations = data.addSubs ? {subscriptions: true, followers: true} : [];

        delete data.addSubs

        Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

        return await this.userService.findOne(data, {relations})
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.USER_IS_FOLLOW)
    async userIsFollow(data: UserIsFollowDTO): Promise<UserIsFollowInterface> {
        if(data.owner_id) {
            const user = await this.userService.findOne({id: data.owner_id}, {relations: {subscriptions: true}})

            return {isFollow: !!user.subscriptions.find(subs => subs.id === data.user_id)}

        } else throw UserIdNotFound
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.USERS_IS_FOLLOW)
    async usersIsFollow(data: UsersIsFollowDTO): Promise<UsersIsFollowsInterface> {
        if(data.owner_id) {
            const user = await this.userService.findOne({id: data.owner_id}, {relations: {subscriptions: true}})

            if(data.users_ids.length) {
                const respond = new Map<string, boolean>()
                user.subscriptions.forEach(subsc => respond.set(subsc.id, data.users_ids.indexOf(subsc.id) !== -1))

                return {follows: respond}
            }
        } else throw UserIdNotFound
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FOLLOW_USER)
    async followUser(data: FollowUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<UserIsFollowInterface>  {
        const isFollow = await this.userService.findOne({id: data.follower_id, subscriptions: {id: data.user_id}}, {relations: {subscriptions: true}})

        if(isFollow) {
            await this.userService.removeSubscription(data.user_id, data.follower_id)
        } else {
            await this.userService.addSubscription(data.user_id, data.follower_id)
        }
        return {isFollow: !isFollow}
    }
}