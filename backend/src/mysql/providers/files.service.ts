import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Files } from "src/entity";
import { UtilService } from "src/common";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Files) private repository: Repository<Files>,
        private util: UtilService
    ) {}
}