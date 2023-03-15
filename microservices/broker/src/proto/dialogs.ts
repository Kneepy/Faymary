/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "dialogs";

export enum DialogActionEnum {
  CREATE_DIALOG = 0,
  ADD_USER = 1,
  REMOVE_USER = 2,
  CHANGE_NAME_DIALOG = 3,
  UNRECOGNIZED = -1,
}

export enum StateDialogEnum {
  DELETED = 0,
  ACTIVE = 1,
  UNRECOGNIZED = -1,
}

export enum ParticipantRights {
  LISTENER = 0,
  USER = 1,
  ADMIN = 2,
  CREATOR = 3,
  UNRECOGNIZED = -1,
}

export interface Dialog {
  id: string;
  participants: DialogParticipants[];
  state: StateDialogEnum;
  name: string;
  file_id: string;
}

export interface DialogParticipants {
  id: string;
  rights: ParticipantRights;
  user_id: string;
  dialog: Dialog | undefined;
}

export interface DialogHistory {
  id: string;
  user_id: string;
  action: DialogActionEnum;
  item_id?: string | undefined;
  desc?: string | undefined;
  createdAt: string;
  dialog: Dialog | undefined;
}

export interface Dialogs {
  dialogs: Dialog[];
}

export interface DialogHistories {
  notes: DialogHistory[];
}

export interface AddUserDialogDTO {
  user_id: string;
  dialog_id: string;
  user_invited_id: string;
}

export interface CreateDialogDTO {
  participants: DialogParticipants[];
  name?: string | undefined;
}

export interface GetDialogDTO {
  id: string;
}

export interface GetUserDialogsDTO {
  user_id: string;
  skip: number;
  take: number;
}

export interface DeleteDialogDTO {
  user_id: string;
  dialog_id: string;
}

export interface DeleteUserDialogDTO {
  delete_id: string;
  user_id: string;
  dialog_id: string;
}

export interface ChangeNameDialogDTO {
  name: string;
  user_id: string;
  dialog_id: string;
}

export interface GetHistoryDialogDTO {
  dialog_id: string;
  take: number;
  skip: number;
}

export interface ChangeFileDialogDTO {
  dialog_id: string;
  file_id: string;
  user_id: string;
}

export interface Empty {
}

export const DIALOGS_PACKAGE_NAME = "dialogs";

export interface DialogsServiceClient {
  addUserToDialog(request: AddUserDialogDTO): Observable<DialogHistory>;

  createDialog(request: CreateDialogDTO): Observable<Dialog>;

  getDialog(request: GetDialogDTO): Observable<Dialog>;

  getAllUserDialogs(request: GetUserDialogsDTO): Observable<Dialogs>;

  deleteDialog(request: DeleteDialogDTO): Observable<Empty>;

  removeUserDialog(request: DeleteUserDialogDTO): Observable<DialogHistory>;

  changeNameDialog(request: ChangeNameDialogDTO): Observable<DialogHistory>;

  changeFileDialog(request: ChangeFileDialogDTO): Observable<DialogHistory>;

  getHistoryDialog(request: GetHistoryDialogDTO): Observable<DialogHistories>;
}

export interface DialogsServiceController {
  addUserToDialog(request: AddUserDialogDTO): Observable<DialogHistory>;

  createDialog(request: CreateDialogDTO): Observable<Dialog>;

  getDialog(request: GetDialogDTO): Observable<Dialog>;

  getAllUserDialogs(request: GetUserDialogsDTO): Observable<Dialogs>;

  deleteDialog(request: DeleteDialogDTO): Observable<Empty>;

  removeUserDialog(request: DeleteUserDialogDTO): Observable<DialogHistory>;

  changeNameDialog(request: ChangeNameDialogDTO): Observable<DialogHistory>;

  changeFileDialog(request: ChangeFileDialogDTO): Observable<DialogHistory>;

  getHistoryDialog(request: GetHistoryDialogDTO): Observable<DialogHistories>;
}

export function DialogsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "addUserToDialog",
      "createDialog",
      "getDialog",
      "getAllUserDialogs",
      "deleteDialog",
      "removeUserDialog",
      "changeNameDialog",
      "changeFileDialog",
      "getHistoryDialog",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("DialogsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("DialogsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const DIALOGS_SERVICE_NAME = "DialogsService";
