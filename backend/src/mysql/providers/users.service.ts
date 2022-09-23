import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entity/users/users.entity";
import { FindOneOptions, Repository } from "typeorm";
import { UsersArgs, UsersInput } from "../dto";
import { Injectable } from "@nestjs/common";
import { Notifications } from "src/entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private repository: Repository<Users>
    ) {}

    public async addNotification(notification: Notifications) {
        return await this.repository.createQueryBuilder().relation(Users, "notifications").of(notification.to).add(notification)
    }

    public async findOne(
        args: UsersArgs,
        options?: FindOneOptions<Users>
    ): Promise<Users> {
        // delete password
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async update(args: Users): Promise<Users> {
        return await this.repository.save(args);
    }

    public async create(args: UsersInput): Promise<Users> {
        return await this.repository.save({ ...args, settings: {} });
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}
