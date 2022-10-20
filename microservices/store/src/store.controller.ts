import { Controller, Post } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller()
export class StoreController {
    @Post()
    async createFile() {}

    @Post()
    async createFiles() {}

    @GrpcMethod()
    async getFiles() {}

    @GrpcMethod() 
    async deleteFiles() {}
}