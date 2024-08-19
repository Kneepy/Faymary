<script setup lang="ts">
import { useInfiniteScroll } from "~/composables/useInfiniteScroll";
import { type Messenger, useUserStore, useContextMenuStore, useMessengerStore } from "~/store";
import { MessagesWsAPI } from "~/api";
import type { Message } from "~/api";

const emit = defineEmits<{
    (e: "loadMore", count: number): void
}>()
const props = defineProps<{
    dialog: Messenger.Dialog
}>()

const userStore = useUserStore()
const contextmenuStore = useContextMenuStore()
const messengerStore = useMessengerStore()

const messagesBoxRef = ref<HTMLBaseElement>(null)
const infiniteScroll = ref(null)
const currentSelectMessage = ref<Message>(null)

onMounted(() => {
    infiniteScroll.value = useInfiniteScroll(messagesBoxRef.value, (count) => emit("loadMore", count));
})
onUnmounted(() => !!infiniteScroll.value && infiniteScroll.value())

const addReaction = (emoji: string, msg?: Message) => {
    const message_id = msg?.id ?? currentSelectMessage.value.id
    const dialog_id = msg?.dialog_id ?? currentSelectMessage.value.dialog_id
    const message = messengerStore.dialogs
        .find(v => dialog_id === v.id)
        .messages.find(v => v.id === message_id)
    const collection = message.attachments?.likes?.find(v => v.unity === emoji)

    if (collection) {
        collection.number_likes += collection.has_liked ? -1 : 1
        collection.has_liked = !collection.has_liked
    } else {
        messengerStore.addLikeMessage(message, { id: null, unity: emoji, has_liked: true, number_likes: 1 })
    }

    MessagesWsAPI.addReaction({ message_id, emoji })
    contextmenuStore.close()
}
const openContextMenu = (e: MouseEvent, message: Message) => {
    contextmenuStore.open(e.x, e.y)
    currentSelectMessage.value = message
}
</script>

<template>
    <div class="dialog">
        <MessageContextMenu
            v-if="contextmenuStore.is_show"
            :x="contextmenuStore.x"
            :y="contextmenuStore.y"
            @onclose="() => contextmenuStore.close()"
            @reaction="addReaction"
        />
        <div :style="{backgroundImage: `url('')`, filter: `blur(3px)` }" class="background"></div>
        <div class="messages scroll" ref="messagesBoxRef">
            <Message
                v-for="message in props.dialog.messages"
                @contextmenu.prevent="(e) => openContextMenu(e, message)"
                @like="(emoji: string) => addReaction(emoji, message)"
                :message="message"
                :own="message.user.id === userStore.me.id"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    padding-right: 5px;
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
    }
    .messages {
        display: flex;
        flex-direction: column-reverse;
        padding: 0 5px;
        overflow-y: auto;
        max-height: 523px;
        min-height: 100px;
        flex: 1;
        position: absolute;
        top: 0;
        left: 5px;
        right: 5px;
    }
}
</style>