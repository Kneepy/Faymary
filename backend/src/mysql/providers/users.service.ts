import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entity/users/users.entity";
import { Repository } from "typeorm";
import { UsersArgs, UsersInput, FindOneOptions } from "../dto";
import { UtilService } from "../../common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private repository: Repository<Users>
    ) {}

    public async findOne(
        args: UsersArgs,
        options?: FindOneOptions
    ): Promise<Users> {

        // delete password
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async update(args: Users): Promise<Users> {
        return await this.repository.save(args);
    }

    public async create(args: UsersInput): Promise<Users> {
        return await this.repository.save(args);
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}
