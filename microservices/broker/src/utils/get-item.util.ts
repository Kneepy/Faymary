import { PostServiceClient } from "src/proto/post"
import { UserServiceClient } from "src/proto/user"
import { CommentsServiceClient } from "src/proto/comments"
import { StoriesServiceClient } from "src/proto/stories"
import { MessagesSerivceClient } from "src/proto/messages"
import { DialogsServiceClient } from "src/proto/dialogs"
import { Inject, Injectable } from "@nestjs/common"
import { COMMENTS_MODULE_CONFIG, DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, POST_MODULE_CONFIG, STORIES_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants"
import { AdditionsType, Fields } from "src/types/additions.type"
import { Observable } from "rxjs"

@Injectable()
export class UtilsService {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postsService: PostServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesSerivceClient
    ) {}

    private handlers = {
        [AdditionsType.USER]: {
            handler: this.userService.findUser,
            field: Fields.USER
        },
        [AdditionsType.COMMENT]: {
            handler: this.commentsService.getComment,
            field: Fields.COMMENT
        },
        [AdditionsType.DIALOG]: {
            handler: this.dialogsService.getDialog,
            field: Fields.DIALOG
        },
        [AdditionsType.MESSAGE]: {
            handler: this.messagesService.getMessage,
            field: Fields.MESSAGE
        },
        [AdditionsType.STORY]: {
            handler: this.storiesService.getStory,
            field: Fields.STORY
        },
        [AdditionsType.POST]: {
            handler: this.postsService.getPost,
            field: Fields.POST
        }
    }

    getItem<T = any>(type: AdditionsType | any, item_id: string): {key: Fields, data: Observable<T>} {
        if (!(type in AdditionsType) || !item_id) return 

        const { handler, field } = this.handlers[type]
        return {data: handler({id: item_id}), key: field}
    }
}