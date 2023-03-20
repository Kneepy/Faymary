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
            CREATE: "dialog.create.message",
            UPDATE: "dialog.update.message",
            DELETE: "dialog.delete.message"
        }
    },
    USER: {
        SUBSCRIBE: "user.subscribe"
    },
    NOTIFICATION: "notification",
    ERROR: "error"
}