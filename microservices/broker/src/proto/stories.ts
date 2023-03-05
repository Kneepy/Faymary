/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "stories";

export enum MarkType {
  user = 0,
  story = 1,
  post = 2,
  UNRECOGNIZED = -1,
}

export interface GetStoriesDTO {
  user_id: string;
}

export interface CreateStoryDTO {
  user_id: string;
  file_id: string;
  marks: Mark[];
}

export interface DeleteStoryDTO {
  id: string;
}

export interface UpdateStoryDTO {
  file_id: string;
  marks: Mark[];
}

export interface Story {
  id: string;
  user_id: string;
  ctratedAt: number;
  file_id: string;
  marks: Mark[];
}

export interface Mark {
  id: string;
  item_id: string;
  type: MarkType;
}

export interface Empty {
}

export const STORIES_PACKAGE_NAME = "stories";

export interface StoriesServiceClient {
  getStories(request: GetStoriesDTO): Observable<Story>;

  createStory(request: CreateStoryDTO): Observable<Story>;

  deleteStory(request: DeleteStoryDTO): Observable<Empty>;

  updateStory(request: UpdateStoryDTO): Observable<Story>;
}

export interface StoriesServiceController {
  getStories(request: GetStoriesDTO): Observable<Story>;

  createStory(request: CreateStoryDTO): Observable<Story>;

  deleteStory(request: DeleteStoryDTO): Observable<Empty>;

  updateStory(request: UpdateStoryDTO): Observable<Story>;
}

export function StoriesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getStories", "createStory", "deleteStory", "updateStory"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StoriesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StoriesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORIES_SERVICE_NAME = "StoriesService";
