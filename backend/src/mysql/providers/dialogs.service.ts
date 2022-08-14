import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Dialogs } from "src/entity";
import { UtilService } from "src/common";
import { DialogsInput, DialogsArgs, FindOneOptions } from "../dto";

@Injectable()
export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        private util: UtilService
    ) {}

    public async update(args: DialogsInput): Promise<Dialogs> {
        return await this.repository.save(args);
    }

    public async findOne(args: DialogsArgs, options: FindOneOptions) {
        return await this.repository.findOne({
            where: this.util.removeUndefined(args),
            ...options
        });
    }
}
