/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "session";

export interface AccessToken {
  user_id: string;
}

export interface VerifyTokensDTO {
  access_token: string;
  refresh_token: string;
}

export interface GenerateTokensDTO {
  fingerprint: string;
  ua: string;
  ip: string;
  user_id: string;
  old_refresh_token: string;
}

export const SESSION_PACKAGE_NAME = "session";

export interface SessionServiceClient {
  verifyTokens(request: VerifyTokensDTO): Observable<AccessToken>;

  generateTokens(request: GenerateTokensDTO): Observable<VerifyTokensDTO>;
}

export interface SessionServiceController {
  verifyTokens(request: VerifyTokensDTO): Observable<AccessToken>;

  generateTokens(request: GenerateTokensDTO): Observable<VerifyTokensDTO>;
}

export function SessionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["verifyTokens", "generateTokens"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SessionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SessionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SESSION_SERVICE_NAME = "SessionService";
