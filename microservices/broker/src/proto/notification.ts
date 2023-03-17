/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "notifications";

export enum NotificationAdditionsEnumType {
  USER = 0,
  STORY = 1,
  POST = 2,
  COMMENT = 3,
  MESSAGE = 4,
  DIALOG = 5,
  LIKE = 6,
  UNRECOGNIZED = -1,
}

export enum NotificationEnumType {
  ADD_COMMENT = 0,
  DELETE_USER_FROM_DIALOG = 1,
  DELETE_DIALOG = 2,
  SUB_USER = 3,
  ADD_LIKE = 4,
  UNRECOGNIZED = -1,
}

export interface Notification {
  id: string;
  type: NotificationAdditionsEnumType;
  item_id: string;
  to_id: string;
  parent_id: string;
  parent_type: NotificationAdditionsEnumType;
  from_id: string;
  createdAt: string;
  notification_type: NotificationEnumType;
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
  type: NotificationAdditionsEnumType;
  parent_id: string;
  parent_type: NotificationAdditionsEnumType;
  notification_type: NotificationEnumType;
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
