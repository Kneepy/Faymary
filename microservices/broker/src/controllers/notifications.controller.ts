import { Controller, Get, Inject, Query, Req } from "@nestjs/common";
import { NOTIFICATIONS_MODULE_CONFIG } from "src/constants/app.constants";
import { Notifications, NotificationsServiceClient } from "src/proto/notification";
import { NotificationGetDTO } from "src/proto/notification";
import { ICustomRequest } from "src/types/request.type";

@Controller("notifications")
export class NotificationController {
    constructor(
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationService: NotificationsServiceClient
    ) {}
 
    @Get()
    async getAllUserNotifications(@Query() {skip, take}: NotificationGetDTO, @Req() {user_id}: ICustomRequest): Promise<Notifications> {
        return await this.notificationService.getAllUserNotifications({user_id, take, skip}).toPromise()
    }
}