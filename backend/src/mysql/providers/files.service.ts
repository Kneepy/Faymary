import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Files } from "src/entity/common/files.entity";
import { Repository, FindOneOptions, FindManyOptions } from "typeorm";
import { FilesArgs, FilesInput, ManyFilesArgs } from "../dto";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Files) private repository: Repository<Files>
    ) {}

    public async findOne(
        args: FilesArgs,
        options?: FindOneOptions<Files>
    ): Promise<Files> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async find(
        args: ManyFilesArgs,
        options?: FindManyOptions<Files>
    ): Promise<Files[]> {
        return await this.repository.find({ where: args, ...options });
    }

    public async update(args: Files): Promise<Files> {
        return await this.repository.save(args);
    }

    public async create(args: FilesInput): Promise<Files> {
        return await this.repository.save({ ...args, createdAt: Date.now() });
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}
