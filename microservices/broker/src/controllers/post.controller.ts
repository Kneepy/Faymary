import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { PostCreateDTO, PostServiceClient, Post as PostEntity, Posts as PostsEntity, PostUpdateDTO, GetManyPostsDTO, GetOnePostDTO, PostDeleteDTO } from './../proto/post';
import { POST_MODULE_CONFIG } from './../app.constants';
import { Inject, Post } from '@nestjs/common';
import { ICustomRequest } from 'src/types/request.type';
import { DisableAuth } from 'src/disable-auth.decorator';

@Controller("post")
export class PostController {
    constructor(
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postService: PostServiceClient
    ) {}

    @Post()
    async createPost(@Req() req: ICustomRequest, @Body() data: Omit<PostCreateDTO, "user_id">): Promise<PostEntity> {
        return await this.postService.createPost({...data, user_id: req.user_id}).toPromise()
    }

    @Patch()
    async updatePost(@Req() req: ICustomRequest, @Body() data: Omit<PostUpdateDTO, "user_id">): Promise<PostEntity> {
        return await this.postService.updatePost({...data, user_id: req.user_id}).toPromise()
    }

    @Delete(":id/delete")
    async deletePost(@Param() query: Omit<PostDeleteDTO, "user_id">, @Req() req: ICustomRequest): Promise<boolean> {
        return await this.postService.deletePost({id: query.id, user_id: req.user_id}).toPromise() ? true : false
    }

    @Get()
    @DisableAuth()
    async getPost(@Query() query: GetOnePostDTO): Promise<PostEntity> {
        return await this.postService.getPost(query).toPromise()
    }

    @Get("/many")
    @DisableAuth()
    async getPosts(@Query() query: GetManyPostsDTO): Promise<PostsEntity> {
        return await this.postService.getPosts(query).toPromise()
    }
}