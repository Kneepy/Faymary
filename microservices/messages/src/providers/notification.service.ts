import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
    NotificationCreateInterface,
    NotificationFindManyInterface,
    NotificationFindOneInterface
} from "../interfaces";
import {
    DEFAULT_ORDER_NOTIFICATIONS,
    DEFAULT_TAKE_NOTIFICATIONS,
    Notifications
} from "../common";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notifications)
        private repository: Repository<Notifications>
    ) {}

    async create(args: NotificationCreateInterface): Promise<Notifications> {
        return await this.repository.save({ ...args, createdAt: Date.now() });
    }

    async findOne(args: NotificationFindOneInterface): Promise<Notifications> {
        return await this.repository.findOne({
            where: args
        });
    }

    async find(
        args: FindOptionsWhere<NotificationFindManyInterface>,
        otherOpt: Omit<FindManyOptions<Notifications>, "where"> = {take: DEFAULT_TAKE_NOTIFICATIONS, skip: DEFAULT_ORDER_NOTIFICATIONS}
    ): Promise<Notifications[]> {
        return await this.repository.find({
            where: args,
            ...otherOpt
        });
    }

    async update(args?: Partial<Notifications>): Promise<Notifications> {
        return await this.repository.save(args);
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id);
    }
}
