/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export enum UserFields {
  followers = 0,
  subscriptions = 1,
  UNRECOGNIZED = -1,
}

export interface GetSubscribeDTO {
  user_id: string;
}

export interface FollowUserDTO {
  user_id: string;
  follower_id: string;
}

export interface FindUserDTO {
  criteria: FindUserBy | undefined;
  fields: UserFields;
}

export interface IsFollow {
  isFollow: boolean;
}

export interface FindUserBy {
  email: string;
  id: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  lastName: string;
  password: string;
  followers: User | undefined;
  subscriptions: User | undefined;
}

export interface Empty {
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findOne(request: FindUserDTO): Observable<User>;

  followUser(request: FollowUserDTO): Observable<IsFollow>;
}

export interface UserServiceController {
  findOne(request: FindUserDTO): Observable<User>;

  followUser(request: FollowUserDTO): Observable<IsFollow>;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "followUser"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
