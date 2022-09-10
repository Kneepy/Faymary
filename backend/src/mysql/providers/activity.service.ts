import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity } from "src/entity/users/activity.entity";
import { Repository } from "typeorm";
import {
    ActivityArgs,
    ActivityInputCreate,
    ActivityInputUpdate,
    FindOneOptions
} from "../dto";

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity) private repository: Repository<Activity>
    ) {}

    public async findOne(
        args: ActivityArgs,
        options: FindOneOptions
    ): Promise<Activity> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async create(input: ActivityInputCreate): Promise<Activity> {
        return await this.repository.save({ ...input, start: Date.now() });
    }

    public async update(input: ActivityInputUpdate): Promise<Activity> {
        return await this.repository.save(input);
    }

    public async delete(activityId: number): Promise<any> {
        return await this.repository.delete(activityId);
    }
}
