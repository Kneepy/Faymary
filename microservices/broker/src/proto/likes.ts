/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "likes";

export enum LikeType {
  POST = 0,
  COMMENT = 1,
  STORY = 2,
  MESSAGE = 3,
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

export interface AddLikeDTO {
  user_id: string;
  item_id: string;
  type: LikeType;
}

export const LIKES_PACKAGE_NAME = "likes";

export interface LikesServiceClient {
  addLike(request: AddLikeDTO): Observable<Like>;
}

export interface LikesServiceController {
  addLike(request: AddLikeDTO): Observable<Like>;
}

export function LikesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addLike"];
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
