import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UploadedFiles
} from "@nestjs/common";
import { ICustomFile, ICustomRequest } from "src/common";
import { Posts } from "src/entity";
import { PostsService, UsersService } from "src/mysql";
import { FindOptionsRelations } from "typeorm";
import { SaveFiles } from "../decorators";
import { CreatePostDto, GetPostDto, UpdatePostDto } from "../dto/posts";

@Controller("post")
export class PostController {
    constructor(
        private postsService: PostsService,
        private usersService: UsersService
    ) {}

    @Get()
    public async getPost(@Query() params: GetPostDto) {
        const post = await this.postsService.findOne(
            { id: params.id },
            { relations: params.relations }
        );
        return post;
    }

    @Post("/create")
    public async createPost(
        @Req() req: ICustomRequest,
        @Body() body: CreatePostDto
    ): Promise<Posts> {
        return await this.postsService.create({
            title: body.title,
            desc: body.desc,
            files: body.files,
            user: await this.usersService.findOne({ id: req.user.userId })
        });
    }

    @Put("/update")
    public async updatePost(@Body() body: UpdatePostDto): Promise<Posts> {
        const post = await this.postsService.findOne({ id: body.id });
        return await this.postsService.update(Object.assign(post, body));
    }

    @Patch("/change-files")
    @SaveFiles("files")
    public async updatePostFiles(
        @Query("id") id: string,
        @UploadedFiles() files: ICustomFile[]
    ): Promise<Posts> {
        const post = await this.postsService.findOne(
            { id },
            { relations: ["files"] }
        );
        post.files = files.map(file => file.savedAs);

        return await this.postsService.update(post);
    }

    @Delete("/delete")
    public async deletePost(@Query("id") id: string): Promise<any> {
        return await this.postsService.remove(id);
    }
}
