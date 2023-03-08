/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "posts";

export interface PostCreateDTO {
  user_id: string;
  title?: string | undefined;
  desc?: string | undefined;
  file_ids?: string | undefined;
}

export interface PostUpdateDTO {
  id: string;
  user_id: string;
  title?: string | undefined;
  desc?: string | undefined;
  file_ids?: string | undefined;
}

export interface PostDeleteDTO {
  id: string;
  user_id: string;
}

export interface GetOnePostDTO {
  id: string;
}

export interface GetManyPostsDTO {
  user_id?: string | undefined;
  title?: string | undefined;
  ids?: string | undefined;
  desc?: string | undefined;
  take: number;
  skip: number;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  createdAt: number;
  desc: string;
  file_ids: string;
}

export interface Posts {
  posts: Post[];
}

export interface Empty {
}

export const POSTS_PACKAGE_NAME = "posts";

export interface PostServiceClient {
  createPost(request: PostCreateDTO): Observable<Post>;

  updatePost(request: PostUpdateDTO): Observable<Post>;

  deletePost(request: PostDeleteDTO): Observable<Empty>;

  getPost(request: GetOnePostDTO): Observable<Post>;

  getPosts(request: GetManyPostsDTO): Observable<Posts>;
}

export interface PostServiceController {
  createPost(request: PostCreateDTO): Observable<Post>;

  updatePost(request: PostUpdateDTO): Observable<Post>;

  deletePost(request: PostDeleteDTO): Observable<Empty>;

  getPost(request: GetOnePostDTO): Observable<Post>;

  getPosts(request: GetManyPostsDTO): Observable<Posts>;
}

export function PostServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createPost", "updatePost", "deletePost", "getPost", "getPosts"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const POST_SERVICE_NAME = "PostService";
