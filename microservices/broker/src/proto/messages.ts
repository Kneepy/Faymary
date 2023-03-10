/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "messages";

export enum MessagesEnumType {
  user = 0,
  post = 1,
  story = 2,
  messages = 3,
  UNRECOGNIZED = -1,
}

export interface Get {
  dialog_id: string;
  take?: number | undefined;
  skip?: number | undefined;
}

export interface Create {
  attachment?: MessagesEnumType | undefined;
  dialog_id: string;
  item_id?: string | undefined;
  message: string;
  user_id: string;
}

export interface Update {
  attachment?: MessagesEnumType | undefined;
  dialog_id: string;
  id: string;
  message: string;
  item_id?: string | undefined;
  user_id: string;
}

export interface Delete {
  id: string;
}

export interface Messages {
  id: string;
  attachment?: MessagesEnumType | undefined;
  item_id?: string | undefined;
  dialog_id: string;
  user_id: string;
  message: string;
  createdAt: string;
}

export const MESSAGES_PACKAGE_NAME = "messages";

export interface MessagesSerivceClient {
  createMessage(request: Create): Observable<Messages>;

  getDialogMessages(request: Get): Observable<Messages>;

  updateMessage(request: Update): Observable<Messages>;

  deleteMessage(request: Delete): Observable<Messages>;
}

export interface MessagesSerivceController {
  createMessage(request: Create): Observable<Messages>;

  getDialogMessages(request: Get): Observable<Messages>;

  updateMessage(request: Update): Observable<Messages>;

  deleteMessage(request: Delete): Observable<Messages>;
}

export function MessagesSerivceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createMessage", "getDialogMessages", "updateMessage", "deleteMessage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MessagesSerivce", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MessagesSerivce", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MESSAGES_SERIVCE_SERVICE_NAME = "MessagesSerivce";
