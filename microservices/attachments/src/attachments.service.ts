import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attachment } from "./common";
import { PreparedAttachment } from "./types";

@Injectable()
export class AttachmentsService {
    constructor(
        @InjectRepository(Attachment) private readonly repository: Repository<Attachment>,
    ) {}

    async findAll(options: Partial<Omit<Attachment, "id">>): Promise<Attachment[]> {
        return this.repository.findBy(options)
    }
    async create(options: Omit<Attachment, "id">): Promise<Attachment> {
        return this.repository.save(options)
    }
    async delete(id: string): Promise<any> {
        return this.repository.delete(id);
    }

    /**
     * Эта функция выдаёт подготовленные вложения для конкретного элемента {parent_type: ..., parent_id: ...}
     * В формате { item_id: ..., type: ... } где item_id = attached_id, type = attached_type
     * Такой формат более удобен в качестве ответа
     */
    prepare(attachment: Attachment): PreparedAttachment {
        return {
            item_id: attachment.attached_id,
            type: attachment.attached_type
        }
    }
}
