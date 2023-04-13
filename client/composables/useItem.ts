import { Store } from "pinia";
import { AdditionsType } from "~~/store/types/additions.type";

/**
 * Эту хрень нужно на беке сделать
 * Я чёт думал что на фронте будет проще но нихрена
 */
enum Fields {
    USER = "user",
    COMMENT = "comment",
    DIALOG = "dialog",
    MESSAGE = "message",
    STORY = "story",
    POST = "post"
}
type StoreActions = {
    [key in AdditionsType]?: {
        handler: (data: any) => Promise<any>;
        store: Store<any>
        field: Fields
    }
}
interface UseItem<T> {
    data: Promise<T>
    key: Fields
}
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const dialogsStore = useDialogsStore()
const storiesStore = useStoriesStore()
const postsStore = usePostsStore()
const storeActionsByAdditonType: StoreActions = {
    [AdditionsType.USER]: {
        handler: userStore.getUserBy,
        store: userStore,
        field: Fields.USER
    },
    [AdditionsType.COMMENT]: {
        handler: commentsStore.getComment,
        store: commentsStore,
        field: Fields.COMMENT
    },
    [AdditionsType.DIALOG]: {
        handler: dialogsStore.getDialog,
        store: dialogsStore,
        field: Fields.DIALOG
    },
    [AdditionsType.MESSAGE]: {
        handler: dialogsStore.getMessage,
        store: dialogsStore,
        field: Fields.MESSAGE
    },
    [AdditionsType.STORY]: {
        handler: storiesStore.getStory,
        store: storiesStore,
        field: Fields.STORY
    },
    [AdditionsType.POST]: {
        handler: postsStore.getPost,
        store: postsStore,
        field: Fields.POST
    }
}
export const useItem = <T = any>(type: AdditionsType, item_id: string): UseItem<T> => ({
    data: storeActionsByAdditonType[type].handler({id: item_id}),
    key: storeActionsByAdditonType[type].field
})