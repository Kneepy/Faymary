import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { PostCreateDTO, PostServiceClient, Post as PostEntity, Posts as PostsEntity, PostUpdateDTO, GetManyPostsDTO, GetOnePostDTO, PostDeleteDTO } from './../proto/post';
import { POST_MODULE_CONFIG, USER_MODULE_CONFIG } from '../constants/app.constants';
import { Inject, Post } from '@nestjs/common';
import { ICustomRequest, BrokerResponse } from 'src/types';
import { DisableAuth } from 'src/disable-auth.decorator';
import { UserServiceClient } from 'src/proto/user';

@Controller("post")
export class PostController {
    constructor(
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postService: PostServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient
    ) {}

    @Post()
    async createPost(@Req() req: ICustomRequest, @Body() data: Omit<PostCreateDTO, "user_id">): Promise<BrokerResponse.Post> {
        const post = await this.postService.createPost({...data, user_id: req.user_id}).toPromise()
        const user = await this.userService.findUser({id: post.user_id}).toPromise()
        
        return {...post, user}
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
    async getPost(@Query() query: GetOnePostDTO): Promise<BrokerResponse.Post> {
        const post = await this.postService.getPost(query).toPromise()
        const user = await this.userService.findUser({id: post.user_id}).toPromise()
    
        return {...post, user}
    }

    @Get("/many")
    @DisableAuth()
    async getPosts(@Query() query: GetManyPostsDTO): Promise<BrokerResponse.Post[]> {
        const posts = (await this.postService.getPosts(query).toPromise()).posts
        
        return Promise.all(posts.map(async post => 
            ({...post, user: await this.userService.findUser({id: post.user_id}).toPromise()})
        ))
    }
}