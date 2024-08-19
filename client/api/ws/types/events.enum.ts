export const WS_EVENTS = {
    ADD_LIKE: "like.add",
    COMMENT: {
        CREATE: "comment.create",
        UPDATE: "comment.update",
        DELETE: "comment.delete"
    },
    DIALOG: {
        CREATE: "dialog.create",
        ADD_USER: "dialog.add_user",
        REMOVE_USER: "dialog.remove_user",
        CHANGE_NAME: "dialog.change_name",
        CHANGE_FILE: "dialog.change_file",
        DELETE: "dialog.delete",
        MESSAGE: {
            CREATE: "dialog.message.create",
            UPDATE: "dialog.message.update",
            DELETE: "dialog.message.delete",
            ADD_REACTION: "dialog.message.add_reaction",
        }
    },
    USER: {
        SUBSCRIBE: "user.subscribe"
    },
    NOTIFICATION: "notification",
    SESSION_TOKEN: "session.token",
    ERROR: "error"
}