import { InjectRepository } from "@nestjs/typeorm";
import { Notifications } from "src/entity";
import { Repository } from "typeorm";
import { NotificationInput } from "../dto";

export class NotificationsService {
    constructor(
        @InjectRepository(Notifications) private repository: Repository<Notifications>
    ) {}

    async create(input: NotificationInput): Promise<Notifications> {
        return await this.repository.save(input)   
    }

    async delete(notificationId: number): Promise<any> {
        return await this.repository.delete(notificationId)
    }
}