import { GrpcMethod } from "@nestjs/microservices"

export class UseR{
    @GrpcMethod("UserService", "FindOne")
    find(data) {
        
    }
}