import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Users } from "./entities";
import { CreateUser, FindUser, UpdateUser } from "./interfaces";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private repository: Repository<Users> 
    ) {}

    async addSubscription(user: Partial<Users> | any, subscriber: Partial<Users> | any) {
        await this.repository.createQueryBuilder().relation(Users, "followers").of(user).add(subscriber)
    }

    async removeSubscription(user: Partial<Users> | any, subscriber: Partial<Users> | any) {
        await this.repository.createQueryBuilder().relation(Users, "followers").of(user).remove(subscriber)
    }

    async findOne(where: FindOptionsWhere<FindUser>, otherOptions?: Omit<FindOneOptions<Users>, "where">): Promise<Users> {
        return await this.repository.findOne({where, ...otherOptions})
    }

    async create(user: CreateUser): Promise<Users> {
        return await this.repository.save(user)
    }

    async update(user: UpdateUser): Promise<Users> {
        return await this.repository.save(user)
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}