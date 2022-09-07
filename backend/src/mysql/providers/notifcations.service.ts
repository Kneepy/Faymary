import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EXPIRES_IN_NOTIFICATION } from "src/config";
import { Notifications } from "src/entity/users/notifications.entity";
import { Repository } from "typeorm";
import { NotificationInput } from "../dto";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notifications)
        private repository: Repository<Notifications>
    ) {}

    async create(input: NotificationInput): Promise<Notifications> {
        return await this.repository.save({...input, createdAt: Date.now(), expirensIn: Date.now() + EXPIRES_IN_NOTIFICATION});
    }

    async delete(notificationId: number): Promise<any> {
        return await this.repository.delete(notificationId);
    }
}
