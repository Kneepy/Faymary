/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "comments";

export enum CommentState {
  UNACTIVE = 0,
  ACTIVE = 1,
  UNRECOGNIZED = -1,
}

export enum CommentType {
  POST = 0,
  STORY = 1,
  COMMENT = 2,
  UNRECOGNIZED = -1,
}

export interface Comment {
  id: string;
  msg: string;
  file_ids: string;
  user_id: string;
  item_id: string;
  type: CommentType;
  createdAt: string;
  state: CommentState;
}

export interface CreateCommentDTO {
  msg: string;
  file_ids: string;
  user_id: string;
  item_id: string;
  type: CommentType;
}

export interface UpdateCommentDTO {
  id: string;
  msg: string;
  file_ids: string;
  user_id: string;
  item_id: string;
  type: CommentType;
  state: CommentState;
}

export interface DeleteCommentDTO {
  id: string;
}

export interface GetCommentsDTO {
  item_id: string;
  type: CommentType;
  take: number;
  skip: number;
}

export interface IsDeleted {
  isDeleted: boolean;
}

export const COMMENTS_PACKAGE_NAME = "comments";

export interface CommentsServiceClient {
  createComment(request: CreateCommentDTO): Observable<Comment>;

  updateComment(request: UpdateCommentDTO): Observable<Comment>;

  deleteComment(request: DeleteCommentDTO): Observable<IsDeleted>;

  getComments(request: GetCommentsDTO): Observable<Comment>;
}

export interface CommentsServiceController {
  createComment(request: CreateCommentDTO): Observable<Comment>;

  updateComment(request: UpdateCommentDTO): Observable<Comment>;

  deleteComment(request: DeleteCommentDTO): Observable<IsDeleted>;

  getComments(request: GetCommentsDTO): Observable<Comment>;
}

export function CommentsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createComment", "updateComment", "deleteComment", "getComments"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CommentsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CommentsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const COMMENTS_SERVICE_NAME = "CommentsService";
