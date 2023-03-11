import {FindManyOptions, Repository} from "typeorm";
import {
    Comments,
    CommentStateEnum,
    DEFAULT_COMMENT_STATE,
    DEFAULT_SKIP_COMMENTS,
    DEFAULT_TAKE_COMMENTS
} from "../common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentType} from "../interfaces";

export class CommentsService {
    constructor(@InjectRepository(Comments) private repository: Repository<Comments>) {}

    async create(comment: CommentType.CreateCommentInterface): Promise<Comments> {
        return await this.repository.save({...comment, createdAt: Date.now(), state: DEFAULT_COMMENT_STATE})
    }

    async update(comment: CommentType.UpdateCommentInterface): Promise<Comments> {
        return await this.repository.save(comment)
    }

    async findOne(criterias: CommentType.FindOneCommentInterface): Promise<Comments> {
        return await this.repository.findOne({where: criterias})
    }

    async find(criterias: CommentType.FindManyCommentsInterface, otherOpt: Omit<FindManyOptions<Comments>, "where"> = {take: DEFAULT_TAKE_COMMENTS, skip: DEFAULT_SKIP_COMMENTS}): Promise<Comments[]> {
        return await this.repository.find({where: criterias, ...otherOpt})
    }

    async delete(id: string): Promise<boolean> {
        const comment = await this.findOne({id})

        if(comment) {
            comment.state = CommentStateEnum.UNACTIVE

            await this.update(comment)

            return true
        } else return false
    }
}