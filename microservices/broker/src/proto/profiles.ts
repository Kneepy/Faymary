/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "profiles";

export interface GetProfileDTO {
  user_id: string;
}

export interface UpdateProfileDTO {
  id: string;
  user_id: string;
  commentsNotification?: boolean | undefined;
  likesNotification?: boolean | undefined;
  subscriptionNotifications?: boolean | undefined;
  deleteDialogNotifications?: boolean | undefined;
  exceptionsFromDialogsNotifications?: boolean | undefined;
}

export interface MoveUserAccountDTO {
  user_id: string;
  profile_id: string;
}

export interface Profile {
  id: string;
  user_id: string;
  commentsNotification: boolean;
  likesNotification: boolean;
  subscriptionNotifications: boolean;
  deleteDialogNotifications: boolean;
  exceptionsFromDialogsNotifications: boolean;
  accounts: Account[];
}

export interface Account {
  id: string;
  user_id: string;
  profile: Profile | undefined;
}

export const PROFILES_PACKAGE_NAME = "profiles";

export interface ProfilesServiceClient {
  getProfile(request: GetProfileDTO): Observable<Profile>;

  updateProfile(request: UpdateProfileDTO): Observable<Profile>;

  addUserAccount(request: MoveUserAccountDTO): Observable<Account>;

  removeUserAccount(request: MoveUserAccountDTO): Observable<Account>;
}

export interface ProfilesServiceController {
  getProfile(request: GetProfileDTO): Observable<Profile>;

  updateProfile(request: UpdateProfileDTO): Observable<Profile>;

  addUserAccount(request: MoveUserAccountDTO): Observable<Account>;

  removeUserAccount(request: MoveUserAccountDTO): Observable<Account>;
}

export function ProfilesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getProfile", "updateProfile", "addUserAccount", "removeUserAccount"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProfilesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProfilesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PROFILES_SERVICE_NAME = "ProfilesService";
