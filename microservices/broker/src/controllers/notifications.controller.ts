import { Controller, Get, Inject, Query, Req } from "@nestjs/common";
import { NOTIFICATIONS_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import { NotificationsServiceClient } from "src/proto/notification";
import { NotificationGetDTO } from "src/proto/notification";
import { UserServiceClient } from "src/proto/user";
import { ICustomRequest, BrokerResponse } from "src/types";
import { UtilsService } from "src/utils/get-item.util";

@Controller("notifications")
export class NotificationController {
    constructor(
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationService: NotificationsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private utilsService: UtilsService
    ) {}
 
    @Get()
    async getAllUserNotifications(@Query() {skip, take}: NotificationGetDTO, @Req() {user_id}: ICustomRequest): Promise<BrokerResponse.Notification[]> {
        const notifications = (await this.notificationService.getAllUserNotifications({user_id, take, skip}).toPromise()).notifications
        const to = await this.userService.findUser({id: user_id}).toPromise()

        return Promise.all(notifications.map(async notification => {
            const parent = this.utilsService.getItem<any>(notification.parent_type, notification.parent_id)
            const item = this.utilsService.getItem<any>(notification.type, notification.item_id)
            const from = await this.userService.findUser({id: notification.from_id}).toPromise()

            return {...notification, parent: {[parent.key]: await parent.data.toPromise()}, item: {[item.key]: await item.data.toPromise()}, from, to}
        }))
    }
}