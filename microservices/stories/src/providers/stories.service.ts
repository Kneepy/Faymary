import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "src/entities/story.enitity";
import { Repository } from "typeorm";

@Injectable()
export class StoriesService {
    constructor(
        @InjectRepository(Story) repository: Repository<Story>
    ) {}
}