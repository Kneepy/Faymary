import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entity";
import { Repository } from "typeorm";
import { UsersArgs, UsersInput, FindOneOptions } from "../dto";
import { UtilService } from "../../common";

export class UsersService {
    constructor(
        @InjectRepository(Users) private repository: Repository<Users>,
        private util: UtilService,
    ) {}

    public async findOne(
        args: UsersArgs,
        options?: FindOneOptions,
    ): Promise<Users> {
        return await this.repository.findOne({
            where: this.util.removeUndefined(args),
            ...options,
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
