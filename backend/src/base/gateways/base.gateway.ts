import { Injectable, UseFilters, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WsException
} from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { AuthService, WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { Notifications, Users, UserSettings } from "src/entity";
import {
    ActivityEnum,
    ActivityService,
    NotificationEnumType,
    NotificationsService,
    UsersService
} from "src/mysql";
import { WsExeptionFilter } from "../filters";

@Injectable()
@WebSocketGateway({ cors: { origin: "*" }, cookie: true })
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private activityService: ActivityService,
        private notificationService: NotificationsService
    ) {}
    private users: Map<string, ICustomSocket> = new Map();

    public findUser(socketId: string): ICustomSocket {
        return this.users.get(socketId);
    }

    public setUser(socketId: string, socket: ICustomSocket) {
        return this.users.set(socketId, socket);
    }

    public deleteUser(socketId: string) {
        return this.users.delete(socketId);
    }

    async setNotification(
        type: NotificationEnumType,
        { sender, user }: { sender: Users; user: Users },
        criteriaUserSettings: boolean = true
    ): Promise<Notifications | undefined> {
        if (
            criteriaUserSettings &&
            !user.notifications.filter(
                notfication =>
                notfication.expirensIn > Date.now() && notfication.sender.id === sender.id && notfication.type === type
            ).length
            && sender.id !== user.id 
        ) {
            const notification = await this.notificationService.create({
                user: user,
                sender: sender,
                type: type
            });

            return notification;
        }
    }

    async handleConnection(
        @ConnectedSocket() socket: ICustomSocket,
        ...[args]: [IncomingMessage]
    ) {
        try {
            const token =
                args.headers.authorization.split(" ")[1] ??
                args.headers.authorization;
            socket.id = this.authService.verifyAccessToken(token).userId;

            socket.user = await this.usersService.findOne(
                { id: socket.id },
                { relations: ["activity"] }
            );

            if (socket.user.activity) {
                socket.user.activity = Object.assign(socket.user.activity, {
                    state: ActivityEnum.ONLINE,
                    start: Date.now()
                });

                socket.state = socket.user.activity;
                await this.usersService.update(socket.user);
            } else {
                socket.state = await this.activityService.create({
                    user: socket.user,
                    state: ActivityEnum.ONLINE
                });
            }
        } catch (e) {
            socket.send(JSON.stringify(new WsException(e)));
        }
        this.users.set(socket.id, socket);
    }

    async handleDisconnect(@ConnectedSocket() socket: ICustomSocket) {
        socket.state = Object.assign(socket.state, {
            state: ActivityEnum.OFFLINE,
            end: Date.now()
        });

        await this.activityService.update(socket.state);

        this.users.delete(socket.id);
    }
}
