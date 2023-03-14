/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "notifications";

export enum NotificationEnumType {
  USER = 0,
  STORY = 1,
  POST = 2,
  COMMENT = 3,
  MESSAGE = 4,
  DIALOG = 5,
  LIKE = 6,
  UNRECOGNIZED = -1,
}

export interface Notification {
  id: string;
  type: NotificationEnumType;
  item_id: string;
  to_id: string;
  parent_id: string;
  parent_type: NotificationEnumType;
  from_id: string;
  createdAt: string;
}

export interface NotificationGetDTO {
  user_id: string;
  skip?: number | undefined;
  take?: number | undefined;
}

export interface NotificationCreate {
  from_id: string;
  to_id: string;
  item_id?: string | undefined;
  type: NotificationEnumType;
  parent_id: string;
  parent_type: NotificationEnumType;
}

export const NOTIFICATIONS_PACKAGE_NAME = "notifications";

export interface NotificationsServiceClient {
  getAllUserNotifications(request: NotificationGetDTO): Observable<Notification>;

  createNotification(request: NotificationCreate): Observable<Notification>;
}

export interface NotificationsServiceController {
  getAllUserNotifications(request: NotificationGetDTO): Observable<Notification>;

  createNotification(request: NotificationCreate): Observable<Notification>;
}

export function NotificationsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAllUserNotifications", "createNotification"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NotificationsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NotificationsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTIFICATIONS_SERVICE_NAME = "NotificationsService";
