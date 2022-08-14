import { Messages } from "src/entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilService } from "src/common";

/* 

всё создания сообщений происходят через dialogsService с помощью отношений Dialog - Messages
возможно придётся сделать поиск сообщений через like

*/
@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages) private repository: Repository<Messages>,
        private util: UtilService
    ) {}

    public async find(args) {
        return await this.repository.find();
    }
}
