<script setup lang="ts">
import { useInfiniteScroll } from "~/composables/useInfiniteScroll";
import { type Messenger, useUserStore, useContextMenuStore, useDraftsMessagesStore } from "~/store";
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
const draftsMessagesStore = useDraftsMessagesStore()

const messagesBoxRef = ref<HTMLBaseElement>(null)
const infiniteScroll = ref(null)
const currentSelectMessage = ref<Message>(null)

onMounted(() => {
    infiniteScroll.value = useInfiniteScroll(messagesBoxRef.value, (count) => emit("loadMore", count));
})
onUnmounted(() => !!infiniteScroll.value && infiniteScroll.value())

const addReaction = (emoji: string, msg?: Message) => {
    const message_id =  msg?.id ?? currentSelectMessage.value.id

    MessagesWsAPI.addReaction({ message_id, emoji })
    contextmenuStore.close()
}
const replyMessage = () => draftsMessagesStore.setOriginalMessage(currentSelectMessage.value.dialog_id, currentSelectMessage.value)
const editMessage = () => draftsMessagesStore.setDraftByMessage(currentSelectMessage.value.dialog_id, currentSelectMessage.value)
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
            @reply="replyMessage"
            @edit="editMessage"
        />
        <div :style="{backgroundImage: `url('')`, filter: `blur(3px)` }" class="background"></div>
        <div class="messages scroll" ref="messagesBoxRef">
            <Message
                v-for="message in props.dialog.messages"
                :key="message.id"
                v-memo="[message.msg, message.attachments, message.user]"
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
        height: 100%;
        min-height: 100px;
        flex: 1;
        position: absolute;
        top: 0;
        left: 5px;
        right: 5px;
    }
}
</style>