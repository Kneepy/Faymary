import { Controller } from "@nestjs/common";
import {
    NOTIFICATION_SERVICE_METHODS,
    NOTIFICATIONS_SERVICE_NAME,
    Notifications,
    NotFoundNotification,
    ImpossibleCreateNotification,
    NOTIFICATION_LIFETIME
} from "src/common";
import { NotificationService } from "../providers";
import { GrpcMethod } from "@nestjs/microservices";
import { NotificationCreateDTO, NotificationGetDTO } from "../dtos";
import {FindOperator, Raw} from "typeorm";

@Controller()
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @GrpcMethod(NOTIFICATIONS_SERVICE_NAME, NOTIFICATION_SERVICE_METHODS.GET_ALL_USER_NOTIFICATIONS)
    async getAllUserNotifications({ user_id, skip, take }: NotificationGetDTO): Promise<Notifications[]> {
        if (user_id) {
            const notifications = await this.notificationService.find(
                { to_id: user_id },
                { skip, take }
            );

            return notifications;
        } else {
            throw NotFoundNotification;
        }
    }

    @GrpcMethod(NOTIFICATIONS_SERVICE_NAME, NOTIFICATION_SERVICE_METHODS.CREATE_NOTIFICATION)
    async createNotification(
        data: NotificationCreateDTO
    ): Promise<Notifications> {
        console.log(data)
        if (!data.from_id || !data.to_id || !data.type) {
            throw ImpossibleCreateNotification;
        } else {
            const existNotification = await this.notificationService.findOne({
                from_id: data.from_id,
                type: data.type,
                createdAt: Raw(
                    alias => `${Date.now()} >= ${alias} + ${NOTIFICATION_LIFETIME}`
                ) as FindOperator<any>
            });

            if(existNotification){
                const updatedNotification = await this.notificationService.update({...existNotification, createdAt: Date.now()})

                return updatedNotification
            }
            else {
                const {from_id, type, to_id, item_id} = data
                const newNotification = await this.notificationService.create({from_id, type, to_id, item_id})

                return newNotification
            }
        }
    }
}
