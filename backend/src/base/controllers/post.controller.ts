import { Body, Controller, Delete, Patch, Post, Query, Req, UploadedFiles } from "@nestjs/common";
import { ICustomFile, ICustomRequest } from "src/common";
import { Posts } from "src/entity";
import { PostsService, UsersService } from "src/mysql";
import { SaveFiles } from "../decorators";
import { CreatePostDto } from "../dto/posts";

@Controller("post")
export class PostController {
    constructor(
        private postsService: PostsService,
        private usersService: UsersService
    ) {}

    @Post("/create")
    @SaveFiles("files")
    public async createPost(
        @UploadedFiles() files: ICustomFile[],
        @Req() req: ICustomRequest,
        @Body() {title, desc}: CreatePostDto,
    ): Promise<Posts> {
        return await this.postsService.create({
            title, desc,
            files: files.map(file => file.savedAs), 
            user: await this.usersService.findOne({id: req.user.userId})
        })
    }

    @Patch("/update")
    public async updatePost(
        @Body() body: Omit<Posts, "files">
    ): Promise<Posts> {
        return await this.postsService.update(body)
    }

    @Patch("/change-files")
    @SaveFiles("files")
    public async updatePostFiles(
        @Query("id") id: string,
        @UploadedFiles() files: ICustomFile[]
    ): Promise<Posts> {
        const post = await this.postsService.findOne({id}, {relations: ["files"]})
        post.files = files.map(file => file.savedAs)

        return await this.postsService.update(post)
    }

    @Delete("/delete")
    public async deletePost(@Query("id") id: string): Promise<any> {
        return await this.postsService.remove(id)
    }
}
