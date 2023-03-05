import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { GetManyPostsDTO, GetOnePostDTO, PostCreateDTO, PostDeleteDTO, PostUpdateDTO } from "./dtos";
import { Posts } from "./entities";
import { MODULE_SERVICE_METHODS, MODULE_SERVICE_NAME } from "./constants/module.constants";
import { PostsService } from "./post.service";
import { POST_ID_UNDEFINED, POST_NOT_FOUND, UNAVAILABLE_OPERATION, USER_ID_UNDEFINED } from "./constants";
import { In } from "typeorm";

@Controller()
export class PostsController {
    constructor(
        private postService: PostsService
    ) {}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.CREATE_POST)
    async createPost(data: PostCreateDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {
        if(!data.user_id) {
            throw USER_ID_UNDEFINED
        }
        if(Array.isArray(data.file_ids)) data.file_ids = this.postService.joinFileIds(data.file_ids)

        const post = await this.postService.create(data)

        return post
    }

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.UPDATE_POST)
    async updatePost(data: PostUpdateDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {
        if(data.id) {
            const post = await this.postService.findOne({id: data.id})

            if(Array.isArray(data.file_ids)) data.file_ids = this.postService.joinFileIds(data.file_ids)
            if(post && post.user_id === data.user_id) {
                
                return await this.postService.update(Object.assign(post, data))

            } else throw POST_NOT_FOUND

        } else throw POST_ID_UNDEFINED
    }

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.DELETE_POST)
    async deletePost(data: PostDeleteDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
        const post = await this.postService.findOne({id: data.id})

        if(post && post.user_id === data.user_id) {

            return await this.postService.delete(post.id)

        } else throw UNAVAILABLE_OPERATION
    }

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.GET_POST)
    async getPost(data: GetOnePostDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {
        return await this.postService.findOne(data)
    }

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.GET_POSTS)
    async getPosts(data: GetManyPostsDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts[]> {
        const criteria: any = {}

        if(data.ids) {
            criteria.id = In(data.ids)
            delete data.ids
        }

        return await this.postService.find({...data, ...criteria})
    }
}