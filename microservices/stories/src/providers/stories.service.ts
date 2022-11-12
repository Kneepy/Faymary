import { FindOptionsWhere } from 'typeorm';
import { FindManyOptions } from 'typeorm';
import { FindManyStoryInterface, FindStoryInterface } from './../interfaces/story-find.interface';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "src/entities/story.enitity";
import { StoryCreateInterface } from "src/interfaces";

@Injectable()
export class StoriesService {
    constructor(
        @InjectRepository(Story) private repository: Repository<Story>
    ) {}

    async create(args: StoryCreateInterface): Promise<Story> {
        return await this.repository.save({...args, createdAt: Date.now()})
    }

    async findOne(args: FindStoryInterface): Promise<Story> {
        return await this.repository.findOne({where: args})
    }

    async find(args: FindOptionsWhere<FindManyStoryInterface>, otherOpt: Omit<FindManyOptions<Story>, "where">): Promise<Story[]> {
        return await this.repository.find({where: args, ...otherOpt})
    }

    async update(args: Story): Promise<Story> {
        return await this.repository.save(args)
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}