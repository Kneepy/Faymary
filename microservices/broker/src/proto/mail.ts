/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "mail";

export interface AccessCode {
  id: string;
  createdAt: number;
  expiresIn: number;
  code: number;
  user_id: string;
}

export interface SendAccessCodeDTO {
  email: string;
  user_id: string;
}

export const MAIL_PACKAGE_NAME = "mail";

export interface MailServiceClient {
  sendAccessCode(request: SendAccessCodeDTO): Observable<AccessCode>;
}

export interface MailServiceController {
  sendAccessCode(request: SendAccessCodeDTO): Observable<AccessCode>;
}

export function MailServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendAccessCode"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MailService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MailService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MAIL_SERVICE_NAME = "MailService";
