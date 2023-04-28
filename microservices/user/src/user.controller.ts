import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import * as bcrypt from "bcryptjs"
import {CreateUserDTO, FindFollowersDTO, FindUserDTO, FindUsersDTO, FollowUserDTO, UpdateUserDTO, UserIsFollowDTO, UsersIsFollowDTO} from "./dtos";
import { Users } from "./entities";
import { USER_SERVICE, USER_SERVICE_METHODS} from "./constants/user.constants";
import { UserService } from "./user.service";
import { IncorrectEmailError, ShortPasswordError, UserAlredyExist, UserIdNotFound, UserEmailNotFound, IncorrectDataError } from "./constants";
import { UserIsFollowInterface, UsersIsFollowsInterface, UserIsLoginedInterface, FollowUserInterface } from "./interfaces";
import { LoginUserDTO } from "./dtos/login-user.dto";

type RepeatedUsers = {users: Users[]}

@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.CREATE_USER) 
    async createUser(data: CreateUserDTO): Promise<Users> {
        if(data.password.length < 6) throw ShortPasswordError
        if(!data.email.split("@")[1] || !data.email.split(".")[1]) throw IncorrectEmailError

        const userName = `id${Date.now()}`
        const existUser = await this.userService.findOne({email: data.email})

        if(!!existUser) throw UserAlredyExist
        
        const passSalt = await bcrypt.genSalt(10);
        data.password = bcrypt.hashSync(data.password, passSalt)

        return await this.userService.create({...data, userName})
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.LOGIN_USER)
    async loginUser(data: LoginUserDTO): Promise<UserIsLoginedInterface> {
        const user = await this.userService.findOne({email: data.email})

        if(!user) throw UserEmailNotFound
            
        return {isLogined: await bcrypt.compare(data.password, user.password), user}
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.UPDATE_USER)
    async updateUser(data: UpdateUserDTO): Promise<Users> {
        const user = await this.userService.findOne({id: data.id})

        if(!user) throw UserIdNotFound

        return await this.userService.update(Object.assign(user, data));
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USERS)
    async find({take, skip, ...data}: FindUsersDTO): Promise<RepeatedUsers> {
        return {users: await this.userService.find(data, {take, skip})}
    }
    
    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_FOLLOWERS)
    async findFollowers(data: FindFollowersDTO): Promise<RepeatedUsers> {
        return {users: await this.userService.find({subscriptions: {id: data.user_id}}, {take: data.take, skip: data.skip}) ?? []}
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_SUBSCRIPTIONS)
    async findSubscriptions(data: FindFollowersDTO): Promise<RepeatedUsers> {
        return {users: await this.userService.find({followers: {id: data.user_id}}, {take: data.take, skip: data.skip}) ?? []}
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FIND_USER)
    async findOne(data: FindUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Users> {
        if(!Object.keys(data).length) throw IncorrectDataError

        return await this.userService.findOne(data) ?? {} as Users
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.USER_IS_FOLLOW)
    async userIsFollow(data: UserIsFollowDTO): Promise<UserIsFollowInterface> {
        if(data.author_id) {
            const user = await this.userService.findOne({id: data.author_id}, {relations: {subscriptions: true}})

            return {isFollow: !!user.subscriptions.find(subs => subs.id === data.user_id)}

        } else throw UserIdNotFound
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.USERS_IS_FOLLOW)
    async usersIsFollow(data: UsersIsFollowDTO): Promise<UsersIsFollowsInterface> {
        if(data.author_id) {
            const user = await this.userService.findOne({id: data.author_id}, {relations: {followers: true}})

            if(data.users_ids.length) {
                const respond = new Map<string, boolean>()
                user.followers.forEach(subsc => respond.set(subsc.id, data.users_ids.indexOf(subsc.id) !== -1))

                return {follows: respond}
            }
        } else throw UserIdNotFound
    }

    @GrpcMethod(USER_SERVICE, USER_SERVICE_METHODS.FOLLOW_USER)
    async followUser(data: FollowUserDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<FollowUserInterface>  {
        if(data.author_id === data.user_id) throw IncorrectDataError

        const isFollow = await this.userService.findOne({id: data.author_id, followers: {id: data.user_id}})

        if(isFollow) {
            await this.userService.removeSubscription(data.author_id, data.user_id)
            
            return {isFollow: !isFollow, author: isFollow}
        }

        await this.userService.addSubscription(data.author_id, data.user_id)
        return {isFollow: !isFollow, author: await this.userService.findOne({id: data.author_id})}
    }
}