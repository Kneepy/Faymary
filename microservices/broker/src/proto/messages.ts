/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "messages";

export enum MessagesEnumType {
  USER = 0,
  STORY = 1,
  POST = 2,
  COMMENT = 3,
  MESSAGE = 4,
  FILE = 7,
  UNRECOGNIZED = -1,
}

export interface GetMessagesDTO {
  dialog_id: string;
  take?: number | undefined;
  skip?: number | undefined;
}

export interface GetMessageDTO {
  id: string;
}

export interface CreateMessageDTO {
  attachment?: MessagesEnumType | undefined;
  dialog_id: string;
  item_id?: string | undefined;
  msg: string;
  user_id: string;
}

export interface UpdateMessageDTO {
  attachment?: MessagesEnumType | undefined;
  dialog_id: string;
  id: string;
  msg?: string | undefined;
  item_id?: string | undefined;
  user_id: string;
}

export interface DeleteMessageDTO {
  id: string;
  user_id: string;
}

export interface Message {
  id: string;
  attachment?: MessagesEnumType | undefined;
  item_id?: string | undefined;
  dialog_id: string;
  user_id: string;
  msg: string;
  createdAt: string;
}

export interface Messages {
  messages: Message[];
}

export const MESSAGES_PACKAGE_NAME = "messages";

export interface MessagesSerivceClient {
  createMessage(request: CreateMessageDTO): Observable<Message>;

  getDialogMessages(request: GetMessagesDTO): Observable<Messages>;

  getMessage(request: GetMessageDTO): Observable<Message>;

  updateMessage(request: UpdateMessageDTO): Observable<Message>;

  deleteMessage(request: DeleteMessageDTO): Observable<Message>;
}

export interface MessagesSerivceController {
  createMessage(request: CreateMessageDTO): Observable<Message>;

  getDialogMessages(request: GetMessagesDTO): Observable<Messages>;

  getMessage(request: GetMessageDTO): Observable<Message>;

  updateMessage(request: UpdateMessageDTO): Observable<Message>;

  deleteMessage(request: DeleteMessageDTO): Observable<Message>;
}

export function MessagesSerivceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createMessage",
      "getDialogMessages",
      "getMessage",
      "updateMessage",
      "deleteMessage",
    ];
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
