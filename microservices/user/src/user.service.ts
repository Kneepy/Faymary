import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { DEFAULT_SKIP_USERS, DEFAULT_TAKE_USERS } from "./constants";
import { Users } from "./entities";
import { CreateUser, FindUser, FindUsers, UpdateUser } from "./interfaces";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private repository: Repository<Users> 
    ) {}

    async addSubscription(user: Partial<Users> | string, subscriber: Partial<Users> | any) {
        await this.repository.createQueryBuilder().relation(Users, "followers").of(user).add(subscriber)
    }

    async removeSubscription(user: Partial<Users> | any, subscriber: Partial<Users> | any) {
        await this.repository.createQueryBuilder().relation(Users, "followers").of(user).remove(subscriber)
    }

    async findOne(where: FindOptionsWhere<FindUser> | FindOptionsWhere<FindUser>[], otherOptions?: Omit<FindOneOptions<Users>, "where">): Promise<Users> {
        return await this.repository.findOne({where, ...otherOptions})
    }

    async find(where: FindOptionsWhere<FindUsers>, {take = DEFAULT_TAKE_USERS, skip = DEFAULT_SKIP_USERS, ...otherOption}: Omit<FindManyOptions<Users>, "where"> = {}): Promise<Users[]> {
        return await this.repository.find({where, take, skip, ...otherOption})
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