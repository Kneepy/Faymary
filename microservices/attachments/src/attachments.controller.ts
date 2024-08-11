import { Controller } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { GrpcMethod } from "@nestjs/microservices";
import {
    ATTACHMENT_SERVICE_METHODS,
    ATTACHMENT_SERVICE_NAME,
    AttachmentType,
    PoorDataError,
    UnknownTypesError
} from "./common";
import { AddAttachmentsDTO, GetAttachmentsDTO, SetAttachmentsDTO } from "./dtos";
import { PreparedAttachment } from "./types";

@Controller()
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    @GrpcMethod(ATTACHMENT_SERVICE_NAME, ATTACHMENT_SERVICE_METHODS.ADD_ATTACHMENT)
    async addAttachment({ parent_type, parent_id, attached_type, attached_id }: AddAttachmentsDTO): Promise<PreparedAttachment> {

        if (![parent_type, parent_id, attached_type, attached_id].every(v => !!v === true)) throw PoorDataError
        if (![attached_type, parent_type].every(v => v in AttachmentType)) throw UnknownTypesError

        const existAttachment = await this.attachmentsService.findAll({ parent_type, parent_id, attached_type, attached_id })

        if (existAttachment.length > 0) return this.attachmentsService.prepare(existAttachment[0])

        const attachment = await this.attachmentsService.create({ parent_type, parent_id, attached_type, attached_id })

        return this.attachmentsService.prepare(attachment)
    }

    @GrpcMethod(ATTACHMENT_SERVICE_NAME, ATTACHMENT_SERVICE_METHODS.GET_ATTACHMENTS)
    async getAttachments({ parent_type, parent_id }: GetAttachmentsDTO): Promise<{attachments: PreparedAttachment[]}> {
        if (!(parent_type in AttachmentType) || !parent_id) return { attachments: [] }

        const attachments = await this.attachmentsService.findAll({ parent_type, parent_id })

        return { attachments: attachments.map(attachment => this.attachmentsService.prepare(attachment)) }
    }

    @GrpcMethod(ATTACHMENT_SERVICE_NAME, ATTACHMENT_SERVICE_METHODS.SET_ATTACHMENTS)
    async setAttachments({ parent_type, parent_id, attachments }: SetAttachmentsDTO): Promise<{attachments: PreparedAttachment[]}> {
        const allParentAttachments = await this.attachmentsService.findAll({ parent_type, parent_id })
        const deleteAttachments = []

        for (const attachment of allParentAttachments) {
            deleteAttachments.push(this.attachmentsService.delete(attachment.id))
        }
        // оптимизация все дела
        await Promise.all(deleteAttachments)

        const setAttachments = []
        for (const attachment of (attachments ?? [])) {
            setAttachments.push(this.attachmentsService.create({ parent_type, parent_id, attached_type: attachment.type, attached_id: attachment.item_id }))
        }

        const newAttachments = await Promise.all(setAttachments)

        return { attachments: newAttachments.map(attachment => this.attachmentsService.prepare(attachment)) }
    }
}

/**
 * TODO: у сообщений нужно сделать поле has_attachments которое будет указвать на то есть ли у сообщения вложения
 */