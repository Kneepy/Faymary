import { Controller } from "@nestjs/common";
import {
    NOTIFICATION_SERVICE_METHODS,
    NOTIFICATIONS_SERVICE_NAME,
    Notifications,
    NotFoundNotification,
    ImpossibleCreateNotification,
    NOTIFICATION_LIFETIME,
    NotificationAdditionsEnumType,
    NotificationEnumType
} from "src/common";
import { NotificationService } from "../providers";
import { GrpcMethod } from "@nestjs/microservices";
import { NotificationCreateDTO, NotificationGetDTO } from "../dtos";
import {Raw} from "typeorm";

@Controller()
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @GrpcMethod(NOTIFICATIONS_SERVICE_NAME, NOTIFICATION_SERVICE_METHODS.GET_ALL_USER_NOTIFICATIONS)
    async getAllUserNotifications({ user_id, skip, take }: NotificationGetDTO): Promise<{notifications: Notifications[]}> {
        if(!user_id) throw NotFoundNotification;

        const notifications = await this.notificationService.find(
            { to_id: user_id },
            { skip, take }
        );

        return {notifications};
    }

    @GrpcMethod(NOTIFICATIONS_SERVICE_NAME, NOTIFICATION_SERVICE_METHODS.CREATE_NOTIFICATION)
    async createNotification(
        data: NotificationCreateDTO
    ): Promise<Notifications> {
        if (!data.from_id || !data.to_id || !(data.type in NotificationAdditionsEnumType) || !data.parent_id || !(data.parent_type in NotificationAdditionsEnumType) || !(data.notification_type in NotificationEnumType)) {
            throw ImpossibleCreateNotification;
        } 
        const existNotification = await this.notificationService.findOne({
            from_id: data.from_id,
            type: data.type,
            item_id: data.item_id,
            parent_id: data.parent_id,
            parent_type: data.parent_type,
            notification_type: data.notification_type,
            to_id: data.to_id,
            createdAt: Raw(
                alias => `${Date.now()} < ${alias} + ${NOTIFICATION_LIFETIME}`
            )
        });

        if(existNotification){
            const updatedNotification = await this.notificationService.update({...existNotification, createdAt: Date.now()})

            return updatedNotification
        }
        else {
            const {from_id, type, to_id, item_id, parent_id, parent_type, notification_type} = data
            const newNotification = await this.notificationService.create({from_id, type, to_id, item_id, parent_id, parent_type, notification_type})

            return newNotification
        }
    }
}
