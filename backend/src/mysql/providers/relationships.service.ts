import { InjectRepository } from "@nestjs/typeorm";
import { DialogUserRelationships } from "src/entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { ManyRelationshipsArgs, RelationshipsArgs, RelationshipsInput } from "../dto";

export class DialogUserRelationshipsService {
    constructor(@InjectRepository(DialogUserRelationships) private repository: Repository<DialogUserRelationships>) {}

    public async find(args: ManyRelationshipsArgs, options?: FindManyOptions<DialogUserRelationships>): Promise<DialogUserRelationships[]> {
        return await this.repository.find({where: args, ...options})
    }

    public async findOne(args: RelationshipsArgs, options?: FindOneOptions<DialogUserRelationships>): Promise<DialogUserRelationships> {
        return await this.repository.findOne({where: args, ...options})
    }

    public async create(input: RelationshipsInput): Promise<DialogUserRelationships> {
        return await this.repository.save({...input, createdAt: Date.now()})
    }

    public async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}