export const WEVENTS = {
    ADD_LIKE: "like.add",
    COMMENTS: {
        CREATE: "comment.create",
        UPDATE: "comment.update",
        DELETE: "comment.delete"
    },
    DIALOGS: {
        CREATE: "dialog.create",
        ADD_USER: "dialog.add_user",
        REMOVE_USER: "dialog.remove_user",
        CHANGE_NAME: "dialog.change_name",
        CHANGE_FILE: "dialog.change_file",
        DELETE: "dialog.delete",
        MESSAGES: {
            CREATE: "dialog.message.create",
            UPDATE: "dialog.message.update",
            DELETE: "dialog.message.delete",
            ADD_LIKE: "dialog.message.add_like",
        }
    },
    USER: {
        SUBSCRIBE: "user.subscribe"
    },
    NOTIFICATION: "notification",
    SESSION_TOKEN: "session.token",
    ERROR: "error"
}