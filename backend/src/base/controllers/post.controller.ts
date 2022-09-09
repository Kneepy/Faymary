import { Body, Controller, Post, Req, UploadedFiles } from "@nestjs/common";
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
        @UploadedFiles() files: ICustomFile,
        @Req() req: ICustomRequest,
        @Body() body: CreatePostDto,
    ): Promise<Posts> {
        return await this.postsService.create({
            ...body,
            files: req.files.map(file => file.savedAs), 
            user: await this.usersService.findOne({id: req.user.userId})
        })
    }
}
