/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "store";

export interface RemoveFileDTO {
  id: string;
}

export interface RemoveFileRes {
}

export const STORE_PACKAGE_NAME = "store";

export interface StoreServiceClient {
  removeFile(request: RemoveFileDTO): Observable<RemoveFileRes>;
}

export interface StoreServiceController {
  removeFile(request: RemoveFileDTO): Observable<RemoveFileRes>;
}

export function StoreServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["removeFile"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StoreService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StoreService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORE_SERVICE_NAME = "StoreService";
