import { InjectRepository } from "@nestjs/typeorm";
import { HistoryActions } from "src/entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import {
    ManyRelationshipsArgs,
    RelationshipsArgs,
    RelationshipsInput
} from "../dto";

export class HistoryActionsService {
    constructor(
        @InjectRepository(HistoryActions)
        private repository: Repository<HistoryActions>
    ) {}

    public async find(
        args: ManyRelationshipsArgs,
        options?: FindManyOptions<HistoryActions>
    ): Promise<HistoryActions[]> {
        return await this.repository.find({ where: args, ...options });
    }

    public async findOne(
        args: RelationshipsArgs,
        options?: FindOneOptions<HistoryActions>
    ): Promise<HistoryActions> {
        return await this.repository.findOne({ where: args, ...options });
    }

    public async create(input: RelationshipsInput): Promise<HistoryActions> {
        return await this.repository.save({ ...input, createdAt: Date.now() });
    }

    public async delete(id: string): Promise<any> {
        return await this.repository.delete(id);
    }
}
