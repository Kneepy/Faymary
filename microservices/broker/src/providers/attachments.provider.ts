import { Inject, Injectable } from "@nestjs/common";
import {
    ATTACHMENTS_MODULE_CONFIG,
    COMMENTS_MODULE_CONFIG,
    DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, POST_MODULE_CONFIG, STORE_MODULE_CONFIG,
    STORIES_MODULE_CONFIG,
    USER_MODULE_CONFIG
} from "../constants/app.constants";
import { UserServiceClient } from "../proto/user";
import { CommentsServiceClient } from "../proto/comments";
import { DialogsServiceClient } from "../proto/dialogs";
import { StoriesServiceClient } from "../proto/stories";
import { PostServiceClient } from "../proto/post";
import { MessagesServiceClient } from "../proto/messages";
import { StoreServiceClient } from "../proto/store";
import { Attachment, AttachmentsServiceClient, AttachmentType, GetAttachmentsDTO } from "../proto/attachments";
import { lastValueFrom } from "rxjs";
import { Addition, Fields } from "../types";

@Injectable()
export class AttachmentsProvider {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postsService: PostServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(STORE_MODULE_CONFIG.PROVIDER) private storeService: StoreServiceClient,
        @Inject(ATTACHMENTS_MODULE_CONFIG.PROVIDER) private attachmentsService: AttachmentsServiceClient
    ) {}

    private handlers = {
        [AttachmentType.USER]: {
            handler: this.userService.findUser,
            field: Fields.USERS
        },
        [AttachmentType.COMMENT]: {
            handler: this.commentsService.getComment,
            field: Fields.COMMENTS
        },
        [AttachmentType.DIALOG]: {
            handler: this.dialogsService.getDialog,
            field: Fields.DIALOGS
        },
        [AttachmentType.MESSAGE]: {
            handler: this.messagesService.getMessage,
            field: Fields.MESSAGES
        },
        [AttachmentType.STORY]: {
            handler: this.storiesService.getStory,
            field: Fields.STORIES
        },
        [AttachmentType.POST]: {
            handler: this.postsService.getPost,
            field: Fields.POSTS
        },
        [AttachmentType.FILE]: {
            handler: this.storeService.getFile,
            field: Fields.FILES
        }
    }

    private typeByField = {
        [Fields.USERS]: AttachmentType.USER,
        [Fields.COMMENTS]: AttachmentType.COMMENT,
        [Fields.DIALOGS]: AttachmentType.DIALOG,
        [Fields.MESSAGES]: AttachmentType.MESSAGE,
        [Fields.STORIES]: AttachmentType.STORY,
        [Fields.POSTS]: AttachmentType.POST,
        [Fields.FILES]: AttachmentType.FILE
    } as const

    async getAttachments({ parent_id, parent_type }: GetAttachmentsDTO): Promise<Addition> {
        const { attachments } = await lastValueFrom(this.attachmentsService.getAttachments({ parent_id, parent_type }))
        const addition = (attachments ?? []).reduce((acc, attachment) => {
            const { handler, field } = this.handlers[attachment.type]

            if (!acc[field]) acc[field] = []

            acc[field].push(handler({ id: attachment.item_id }).toPromise())

            return acc
        }, <Addition> {})

        const result: Addition = {}

        for (const [key, value] of Object.entries(addition)) {
            result[key] = await Promise.all(value)
        }

        return result
    }

    async setAttachments({ parent_id, parent_type }, addition: Addition): Promise<Addition> {
        const attachments = Object.entries(addition ?? []).reduce((acc, [key, value]) => {

            if (!Object.values(Fields).includes(key as any)) return acc

            value.forEach(v => acc.push({type: this.typeByField[key], item_id: v.id}))

            return acc

        }, <Attachment[]> [])

        await lastValueFrom(this.attachmentsService.setAttachments({ parent_id, parent_type, attachments }))

        return await this.getAttachments({ parent_id, parent_type })
    }
}