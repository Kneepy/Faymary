/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "likes";

export enum LikeType {
  USER = 0,
  STORY = 1,
  POST = 2,
  COMMENT = 3,
  MESSAGE = 4,
  UNRECOGNIZED = -1,
}

export enum LikeState {
  NOT_ACTIVE = 0,
  ACTIVE = 1,
  UNRECOGNIZED = -1,
}

export interface Like {
  id: string;
  type: LikeType;
  item_id: string;
  user_id: string;
  createdAt: string;
  state: LikeState;
}

export interface GetCountLikesDTO {
  type: LikeType;
  item_id: string;
}

export interface CountLikes {
  count: number;
}

export interface CheckLikeDTO {
  user_id: string;
  item_id: string;
  type: LikeType;
}

export interface IsLiked {
  isLiked: boolean;
}

export interface AddLikeDTO {
  user_id: string;
  item_id: string;
  type: LikeType;
}

export const LIKES_PACKAGE_NAME = "likes";

export interface LikesServiceClient {
  addLike(request: AddLikeDTO): Observable<Like>;

  getCountLikes(request: GetCountLikesDTO): Observable<CountLikes>;

  checkLike(request: CheckLikeDTO): Observable<IsLiked>;
}

export interface LikesServiceController {
  addLike(request: AddLikeDTO): Observable<Like>;

  getCountLikes(request: GetCountLikesDTO): Observable<CountLikes>;

  checkLike(request: CheckLikeDTO): Observable<IsLiked>;
}

export function LikesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addLike", "getCountLikes", "checkLike"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("LikesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("LikesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LIKES_SERVICE_NAME = "LikesService";
