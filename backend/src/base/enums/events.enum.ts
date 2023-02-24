export enum Events {
    NEW_NOTIFICATION = "notification.new",
    SUB_USER = "user.subscribe",
    CREATE_DIALOG = "dialog.create",

    // create data
    ADD_COMMENT_POST = "post.add.comment",
    ADD_LIKE_POST = "post.add.like",
    ADD_LIKE_COMMENT = "post.comment.add.like",
    ADD_ANSWER_COMMENT = "post.comment.add.answer",

    ADD_MESSAGE_DIALOG = "dialog.add.message",
    ADD_USER_DIALOG = "dialog.add.user",
    TRANSMIT_MESSAGE_DIALOG = "dialog.transmit-message",
    REMOVE_USER_DIALOG = "dialog.remove.user",
    UPDATE_DIALOG = "dialog.update",

    ADD_STORY = "story.add",
    ADD_LIKE_STORY = "story.add.like",
    ADD_REFERENCE_STORY = "story.add.reference",
    REMOVE_STORY = "story.remove",

    // update data
    REFRESH_USER = "user.refresh",
    REFRESH_POST = "post.refresh",
    REFRESH_COMMENT = "post.comment.refresh",
    REFRESH_DIALOG = "dialog.refresh",
    REFRESH_MESSAGES = "dialogs.messages.refresh",
}
