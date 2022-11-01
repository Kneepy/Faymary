import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { GetManyPostsDTO, GetOnePostDTO, PostCreateDTO, PostDeleteDTO, PostUpdateDTO } from "./dtos";
import { Posts } from "./entities";
import { MODULE_SERVICE_METHODS, MODULE_SERVICE_NAME } from "./module.constants";
import { PostsService } from "./post.service";

@Controller()
export class PostsController {
    constructor(
        private postService: PostsService
    ) {}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.CREATE_POST)
    async createPost(data: PostCreateDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {return}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.UPDATE_POST)
    async updatePost(data: PostUpdateDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {return}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.DELETE_POST)
    async deletePost(data: PostDeleteDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {return}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.GET_POST)
    async getPost(data: GetOnePostDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts> {return}

    @GrpcMethod(MODULE_SERVICE_NAME, MODULE_SERVICE_METHODS.GET_POSTS)
    async getPosts(data: GetManyPostsDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Posts[]> {return}
}