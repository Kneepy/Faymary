<script setup lang="ts">
import { useInfiniteScroll } from "~/composables/useInfiniteScroll";
import { useUserStore, useContextMenuStore, useDraftsMessagesStore, DraftsMessages } from "~/store";
import { DialogsAPI, DialogsWsAPI, MessagesWsAPI } from "~/api";
import type { Message } from "~/api";
import { ReceiveFiles } from "assets/helpers/receive-files";

const userStore = useUserStore()
const contextmenuStore = useContextMenuStore()
const messengerStore = useMessengerStore()
const draftsMessagesStore = useDraftsMessagesStore()

const draftMessage = ref<DraftsMessages.Draft>(null)
const dialog = computed(() => messengerStore.dialogs?.find(dialog => dialog.id === messengerStore.currentDialog))

const dialogName = ref<string>("")
const messagesBoxRef = ref<HTMLBaseElement>(null)
const inputFileRef = ref<HTMLInputElement>(null)
const infiniteScroll = ref(null)
const currentSelectMessage = ref<Message>(null)

onMounted(async () => {
    // находим наш диалог
    draftMessage.value = draftsMessagesStore.getDraft(messengerStore.currentDialog)

    if (!!dialog.value?.messages?.length) return

    // получаем сообщения для диалога
    const messages = await DialogsAPI.getDialogMessages(messengerStore.currentDialog, { take: 10, skip: 0 })
    messengerStore.insertMessagesDialog(messengerStore.currentDialog, messages)

    infiniteScroll.value = useInfiniteScroll(messagesBoxRef.value, async (count) => {
        const messages = await DialogsAPI.getDialogMessages(messengerStore.currentDialog, { take: 10, skip: (count + 1) * 10 })
        messengerStore.insertMessagesDialog(messengerStore.currentDialog, messages)
    })

    if (dialog.value.number_participants > 2) dialogName.value = dialog.value.name
    else {
        const interlocutor = dialog.value.participants.find(participant => participant.user.id !== userStore.me.id)

        dialogName.value = interlocutor.user.fullName
    }
})
onUnmounted(() => !!infiniteScroll.value && infiniteScroll.value())


/**
 * Функции для управления UI
 */
const isOpenDialogInfoModal = ref(false)
const openDialogInfoModal = () => isOpenDialogInfoModal.value = true
const closeDialogInfoModal = () => isOpenDialogInfoModal.value = false

/**
 * Ниже функции для сообщений
 */
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

/**
 * Ниже функции для поля ввода нового сообщения
 */
const receiveFiles = (e: Event) => {
    const files = ReceiveFiles(e)
    files.forEach(file => draftsMessagesStore.addFile(messengerStore.currentDialog, file))
}
const removeReply = () => draftsMessagesStore.removeOriginalMessage(messengerStore.currentDialog)
const clickAttachFileButton = () => inputFileRef.value.click()
const sendMessage = async () => {
    const preparedMessage = await draftsMessagesStore.prepareMessage(messengerStore.currentDialog)

    if (draftMessage.value.editedMessage) {
        await DialogsWsAPI.updateMessage({ id: draftMessage.value.editedMessage.id, ...preparedMessage })
    }
    else {
        await DialogsWsAPI.createMessage(preparedMessage)
    }

    draftsMessagesStore.clear(messengerStore.currentDialog)
}
</script>

<template>
    <div class="dialog">
        <div class="top-box">
            <div class="user-info" @click="openDialogInfoModal">
                <div class="user-name">{{ dialogName }}</div>
                <div class="user-status">был(а) в сети 1 час назад</div>
            </div>
            <div class="dialog-options">
                <IconButton>
                    <GIcon fill :size=22>search</GIcon>
                </IconButton>
                <IconButton>
                    <GIcon fill :size=22>call</GIcon>
                </IconButton>
                <IconButton>
                    <GIcon fill :size=22>more_vert</GIcon>
                </IconButton>
            </div>
        </div>
        <MessageContextMenu
            v-if="contextmenuStore.is_show"
            :x="contextmenuStore.x"
            :y="contextmenuStore.y"
            @onclose="() => contextmenuStore.close()"
            @reaction="addReaction"
            @reply="replyMessage"
            @edit="editMessage"
        />
        <div class="chat">
            <div :style="{backgroundImage: `url('')`, filter: `blur(3px)` }" class="background"></div>
            <div class="messages scroll" ref="messagesBoxRef">
                <Message
                    v-for="message in dialog.messages"
                    :key="message.id"
                    v-memo="[message.msg, message.attachments, message.user]"
                    @contextmenu.prevent="(e) => openContextMenu(e, message)"
                    @like="(emoji: string) => addReaction(emoji, message)"
                    :message="message"
                    :own="message.user.id === userStore.me.id"
                />
            </div>
        </div>
        <div @drop.prevent.stop="receiveFiles" class="bottom-box">
            <div class="attachments">
                <div v-if="!!draftMessage?.originalMessage" class="reply">
                    <GIcon fill :weight="600" :size="25">reply</GIcon>
                    <div class="message">
                        <div class="user">{{ draftMessage.originalMessage.user.fullName }}</div>
                        <div class="text">{{ !!draftMessage.originalMessage.msg ? draftMessage.originalMessage.msg : "Сообщение" }}</div>
                    </div>
                    <IconButton @click="removeReply" class="remove">
                        <GIcon fill :weight="600" :size="25">close</GIcon>
                    </IconButton>
                </div>
                <div v-if="!!draftMessage?.files?.length || !!draftMessage?.fileRefs?.length" class="files">
                    <HorizontalScroll>
                        <div
                            v-for="file in (draftMessage.fileRefs ?? [])"
                            @click="draftsMessagesStore.removeFileRef(messengerStore.currentDialog, file)"
                            class="file"
                        >
                            <div class="trash">
                                <GIcon fill :weight="700" :size=15>delete</GIcon>
                            </div>
                            <div :style="{ backgroundImage: `url(${file.href})` }" class="img"></div>
                        </div>
                        <div v-if="!!draftMessage?.fileRefs?.length && !!draftMessage?.files?.length" class="separator"></div>
                        <div
                            v-for="file in (draftMessage.files ?? [])"
                            @click="draftsMessagesStore.removeFile(messengerStore.currentDialog, file)"
                            class="file"
                        >
                            <div class="trash">
                                <GIcon fill :weight="700" :size=15>delete</GIcon>
                            </div>
                            <div :style="{ backgroundImage: `url(${file.href})` }" class="img"></div>
                        </div>
                    </HorizontalScroll>
                </div>
            </div>
            <div class="input-message">
                <IconButton @click="clickAttachFileButton">
                    <GIcon :size="25" style="transform: rotate(30deg)">attach_file</GIcon>
                    <input
                        @input="receiveFiles"
                        ref="inputFileRef"
                        type="file"
                        accept="image/*"
                        multiple
                    >
                </IconButton>
                <TextareaAutosize
                    class="scroll"
                    placeholder="Напишите что-нибудь..."
                    @change="(v: string) => draftsMessagesStore.setMessage(messengerStore.currentDialog, v)"
                    :value="draftMessage?.message"
                    :max-height=170
                />
                <IconButton>
                    <GIcon :size="25" fill>family_star</GIcon>
                </IconButton>
                <IconButton @click="sendMessage">
                    <GIcon :size="25" fill>play_arrow</GIcon>
                </IconButton>
            </div>
        </div>


        <DialogInfoModal v-if="isOpenDialogInfoModal" @on-close="closeDialogInfoModal" />
    </div>
</template>

<style scoped lang="scss">
.dialog {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .chat {
        position: relative;
        flex: 1;
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
    .top-box {
        background-color: $transparent_hover_background;
        display: flex;
        justify-content: space-between;
        .user-info {
            flex: 1;
            padding: 10px 30px;
            cursor: pointer;
            .user-name {
                color: $white;
                font-weight: 600;
                font-size: 16px;
            }
            .user-status {
                color: $gray;
                font-size: 14px;
            }
        }
        .dialog-options {
            display: flex;
            align-items: center;
            padding-right: 10px;
            button {
                background-color: transparent;
                margin-right: 5px;
                border-radius: 15px;
                &:hover {
                    background-color: $transparent_button_hover_17;
                    .icon {
                        color: $white_gray;
                    }
                }
                .icon {
                    color: $gray;
                }
            }
        }
    }
    .bottom-box {
        padding: 10px;
        display: flex;
        border-top: 1px solid $primary_border;
        align-items: center;
        flex-direction: column;
        .attachments {
            width: 100%;
            max-width: 100%;
            &::-webkit-scrollbar {
                width: 0;
                height: 0;
            }
            .files {
                overflow: auto;
                padding: 5px 0;
                display: flex;
                .file {
                    width: 80px;
                    height: 80px;
                    margin: 2px 2px 2px 10px;
                    border-radius: 10px;
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                    .trash {
                        position: absolute;
                        right: 5px;
                        top: 5px;
                        display: flex;
                        align-items: center;
                        border-radius: 50%;
                        background-color: $white;
                        justify-content: center;
                        padding: 2px;
                        z-index: 10;
                        opacity: 0;
                        .icon {
                            color: $black;
                        }
                    }
                    .img {
                        width: 100%;
                        height: 100%;
                        background-position: center;
                        background-size: cover;
                    }
                    &:hover {
                        box-shadow: 0 0 0 1px $white;
                        .img {
                            filter: blur(3px);
                        }
                        .trash {
                            opacity: 1;
                        }
                    }
                }
                .separator {
                    width: 2px;
                    height: 60px;
                    background-color: $border;
                    margin: 0 10px;
                    align-self: center;
                    border-radius: 5px;
                }
            }
            .reply {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 5px 25px 15px;
                .message {
                    flex: .9;
                    display: flex;
                    flex-direction: column;
                    padding: 5px 20px;
                    overflow: hidden;
                    border-radius: 5px;
                    cursor: pointer;
                    background-color: rgba(223, 223, 223, .05); // и этот тоже
                    border-left: 5px solid $white; // этот цвет должен выбираться в настройках мессенджера
                    .user {
                        color: rgba(223, 223, 223, 1); // этот цвет должен выбираться в настройках мессенджера
                        font-weight: 700;
                        font-size: 14px;
                    }
                    .text {
                        color: $gray;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: 15px;
                        white-space: nowrap;
                    }
                }
                .icon {
                    color: $white;
                }
                .remove {
                    background-color: transparent;
                    cursor: pointer;
                }
            }
        }
        .input-message {
            flex: 1;
            display: flex;
            width: 100%;
            button {
                background-color: transparent;
                cursor: pointer;
                padding: 9px;
                flex: 0;
                &:hover {
                    background-color: $transparent_button_hover_1;
                    .icon {
                        color: $gray;
                    }
                }
                &:last-child {
                    margin-left: 5px;
                }
                .icon {
                    color: $gray_1;
                }
            }
            textarea {
                flex: 1;
                background-color: transparent;
                border: none;
                padding: 10px 20px;
                color: $white;
                border-radius: 10px;
                font-size: 15px;
                resize: none;
                max-height: 350px;
                align-self: center;
                &::placeholder {
                    color: $gray_1;
                    transition: 200ms;
                }
                &:focus {
                    border: none;
                    outline: none;
                }
                &:hover, &:focus {
                    &::placeholder {
                        color: $gray;
                        transition: 200ms;
                    }
                }
            }
            input[type="file"] {
                width: 0;
            }
        }
    }
}
</style>