import { InjectRepository } from "@nestjs/typeorm";
import { Mark } from "src/entities";
import { Repository } from "typeorm";

export class MarksService {
    constructor(
        @InjectRepository(Mark) private marksService: Repository<Mark>
    ) {}

    async create() {
        
    }
}