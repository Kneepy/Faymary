import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { File } from "./entities";

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(File) private repository: Repository<File>
    ) {}

    async findOne(where: FindOptionsWhere<File>, otherOtions?: FindOneOptions<File>): Promise<File> {
        return await this.repository.findOne({where, ...otherOtions})
    }

    async find(where: FindOptionsWhere<File>, otherOtions?: FindManyOptions<File>): Promise<File[]> {
        return await this.repository.find({where, ...otherOtions})
    }

    async create(entity: Omit<File, "id" | "createdAt">): Promise<File> {
        return await this.repository.save({...entity, createdAt: Date.now()})
    }

    async delete(id: string) {
        return await this.repository.delete(id)
    }
}