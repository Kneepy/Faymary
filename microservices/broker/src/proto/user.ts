/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export enum UserState {
  UNACTIVE = 0,
  ACTIVE = 1,
  UNRECOGNIZED = -1,
}

export interface FindFollowersDTO {
  take: number;
  skip: number;
  user_id: string;
}

export interface CreateUserDTO {
  email: string;
  lastName: string;
  userName: string;
  password: string;
  state: UserState;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserIsLogined {
  isLogined: boolean;
  user: User | undefined;
}

export interface FollowUserDTO {
  user_id: string;
  follower_id: string;
}

export interface FindUsersDTO {
  take?: number | undefined;
  email?: string | undefined;
  username?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  followers?: User | undefined;
  subscriptions?: User | undefined;
  state?: UserState | undefined;
  skip?: number | undefined;
  addSubs?: boolean | undefined;
}

export interface UserIsFollowResult {
  isFollow: boolean;
}

export interface UsersIsFollowResult {
  follows: { [key: string]: boolean };
}

export interface UsersIsFollowResult_FollowsEntry {
  key: string;
  value: boolean;
}

export interface FindUserDTO {
  email?: string | undefined;
  id?: string | undefined;
  lastName?: string | undefined;
  addSubs?: boolean | undefined;
}

export interface User {
  id: string;
  email: string;
  username: string;
  lastName: string;
  password: string;
  followers: User | undefined;
  subscriptions: User | undefined;
  state: UserState;
  file_id: string;
}

export interface UpdateUserDTO {
  id: string;
  email?: string | undefined;
  username?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  followers?: User | undefined;
  subscriptions?: User | undefined;
  state?: UserState | undefined;
  file_id?: string | undefined;
}

export interface Users {
  users: User[];
}

export interface UserIsFollowDTO {
  user_id: string;
  owner_id: string;
}

export interface UsersIsFollowDTO {
  owner_id: string;
  users_ids: string[];
}

export interface Empty {
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findUser(request: FindUserDTO): Observable<User>;

  followUser(request: FollowUserDTO): Observable<UserIsFollowResult>;

  userIsFollow(request: UserIsFollowDTO): Observable<UserIsFollowResult>;

  usersIsFollow(request: UsersIsFollowDTO): Observable<UsersIsFollowResult>;

  createUser(request: CreateUserDTO): Observable<User>;

  loginUser(request: LoginUserDTO): Observable<UserIsLogined>;

  updateUser(request: UpdateUserDTO): Observable<User>;

  findUsers(request: FindUsersDTO): Observable<Users>;

  findSubscriptions(request: FindFollowersDTO): Observable<Users>;

  findFollowers(request: FindFollowersDTO): Observable<Users>;
}

export interface UserServiceController {
  findUser(request: FindUserDTO): Observable<User>;

  followUser(request: FollowUserDTO): Observable<UserIsFollowResult>;

  userIsFollow(request: UserIsFollowDTO): Observable<UserIsFollowResult>;

  usersIsFollow(request: UsersIsFollowDTO): Observable<UsersIsFollowResult>;

  createUser(request: CreateUserDTO): Observable<User>;

  loginUser(request: LoginUserDTO): Observable<UserIsLogined>;

  updateUser(request: UpdateUserDTO): Observable<User>;

  findUsers(request: FindUsersDTO): Observable<Users>;

  findSubscriptions(request: FindFollowersDTO): Observable<Users>;

  findFollowers(request: FindFollowersDTO): Observable<Users>;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "findUser",
      "followUser",
      "userIsFollow",
      "usersIsFollow",
      "createUser",
      "loginUser",
      "updateUser",
      "findUsers",
      "findSubscriptions",
      "findFollowers",
    ];
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
