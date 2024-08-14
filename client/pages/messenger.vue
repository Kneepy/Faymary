<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";
import SettingsModal from "~/components/Messenger/Modals/SettingsModal.vue";
import BlockedUsersModal from "~/components/Messenger/Modals/BlockedUsersModal.vue";
import CreateDialogModal from "~/components/Messenger/Modals/CreateDialogModal.vue";
import Dialog from "~/components/Messenger/Dialog.vue"
import { type Messenger, useMessengerStore, useDraftsMessagesStore, DraftsMessages } from "~/store/messenger";
import { DialogsAPI, DialogsWsAPI } from "~/api";
import SkeletonDialogBlock from "~/components/Messenger/Cards/SkeletonDialogCard.vue";
import { ReceiveFiles } from "assets/helpers/receive-files";

definePageMeta({
    requiredAuth: true, // это только на время разработки, так должно быть true
    name: ROUTES.MESSENGER,
    layout: false // только на время разработки, но в обычное время default или просто удалить layout
})
useHead({
    title: "Сообщения"
})

const messengerStore = useMessengerStore()
const userStore = useUserStore()
const draftsMessagesStore = useDraftsMessagesStore()

// функции для открытия списка избранных сообщений
const isOpenImportantMsgModal = ref(false)
const openImportantMsgModal = () => isOpenImportantMsgModal.value = true
const closeImportantMsgModal = () => isOpenImportantMsgModal.value = false

// функции для открытия настроек
const isOpenSettingsModal = ref(false)
const openSettingsModal = () => isOpenSettingsModal.value = true
const closeSettingsModal = () => isOpenSettingsModal.value = false

// функции для открытия списка заблокированных пользователей
const isOpenBlockedUsersModal = ref(false)
const openBlockedUsersModal = () => isOpenBlockedUsersModal.value = true
const closeBlockedUsersModal = () => isOpenBlockedUsersModal.value = false

// функции для открытия информации о диалоге
const isOpenDialogInfoModal = ref(false)
const openDialogInfoModal = () => isOpenDialogInfoModal.value = true
const closeDialogInfoModal = () => isOpenDialogInfoModal.value = false

// функции для открытия информации о диалоге
const isOpenCreateDialogModal = ref(false)
const openCreateDialogModal = () => isOpenCreateDialogModal.value = true
const closeCreateDialogModal = () => isOpenCreateDialogModal.value = false

// маркер показывающий загружены ли диалоги
const isLoadingDialogs = ref(false)

// ссылка на текущий черновик сообщения
const draftMessage = ref<DraftsMessages.Draft>(null)

// ссылка на текущий диалог
const currentDialog = computed(() => messengerStore.dialogs?.find(v => v.id === messengerStore.currentDialog))

// название текущего диалога
const dialogName = ref<string>("")

// ссылка на элемент для прикрепления картинок/файлов
const inputFileRef = ref<HTMLInputElement>(null)

onMounted(async () => {
    // получаем все переписки пользователя и заносим их в состояние
    isLoadingDialogs.value = true

    const userDialogs = await DialogsAPI.getUserDialogs({take: 10, skip: 0}) ?? []
    messengerStore.addDialogs(<Messenger.Dialog[]> userDialogs)

    isLoadingDialogs.value = false
})
watch(() => messengerStore.currentDialog, async (dialog_id) => {

    if (!dialog_id) return

    // находим наш диалог
    const dialog = messengerStore.dialogs.find(dialog => dialog.id === dialog_id)
    draftMessage.value = draftsMessagesStore.getDraft(dialog_id)

    if (dialog.messages) return

    // получаем сообщения для диалога
    const messages = await DialogsAPI.getDialogMessages(dialog_id, { take: 10, skip: 0 })
    messengerStore.insertMessagesDialog(dialog_id, messages)

    // проверяем название диалога
    if (currentDialog.value.number_participants > 2) dialogName.value = currentDialog.value.name
    else {
        const interlocutor = currentDialog.value.participants.find(participant => participant.user.id !== userStore.me.id)

        dialogName.value = interlocutor.user.fullName
    }
})

const clickAttachFileButton = () => inputFileRef.value.click()
const receiveFiles = (e: Event) => {
    const files = ReceiveFiles(e)
    files.forEach(file => draftsMessagesStore.addFile(messengerStore.currentDialog, file))
}
const getURLPreviewFile = (file: File) => URL.createObjectURL(file)
const sendMessage = async () => {
    const preparedMessage = await draftsMessagesStore.prepareMessage(messengerStore.currentDialog)

    await DialogsWsAPI.createMessage(preparedMessage)

    draftsMessagesStore.clear(messengerStore.currentDialog)
}
const loadMoreMessages = async (skip_chunks: number) => {
    const messages = await DialogsAPI.getDialogMessages(messengerStore.currentDialog, { take: 10, skip: (skip_chunks + 1) * 10 })
    messengerStore.insertMessagesDialog(messengerStore.currentDialog, messages)
}

DialogsWsAPI.listenNewMessages(message => {
    messengerStore.insertMessagesDialog(message.dialog_id, [ message ])


})
</script>
<template>
    <div class="messenger">
        <div class="left-bar">
            <div class="top-menu">
                <div class="options">
                    <div class="left">
                        <IconButton>
                            <GIcon fill :weight=600>keyboard_backspace</GIcon>
                        </IconButton>
                    </div>
                    <div class="right">
                        <IconButton @click="openCreateDialogModal">
                            <GIcon fill :weight=700>stylus</GIcon>
                        </IconButton>
                        <IconButton @click="openImportantMsgModal">
                            <GIcon fill :weight=700>star</GIcon>
                        </IconButton>
                        <IconButton @click="openBlockedUsersModal">
                            <GIcon fill :weight=700>block</GIcon>
                        </IconButton>
                        <IconButton @click="openSettingsModal">
                            <GIcon fill :weight=700>settings</GIcon>
                        </IconButton>
                    </div>
                </div>
                <div class="search">
                    <input type="text" placeholder="Найдите нужный вам диалог!">
                    <IconButton class="search-btn">
                        <GIcon>hexagon</GIcon>
                    </IconButton>
                </div>
            </div>
            <div class="dialogs scroll">
                <template v-if="!isLoadingDialogs">
                    <DialogCard
                        v-for="(dialog, key) in messengerStore.dialogs"
                        @click="messengerStore.changeCurrentDialog(dialog.id)"
                        :dialog
                        :key
                    />
                </template>
                <SkeletonDialogBlock v-if="messengerStore.dialogs?.length === 0 && isLoadingDialogs" />
                <div v-if="messengerStore.dialogs?.length === 0 && !isLoadingDialogs" class="no-dialogs">Пока вы ещё ни с кем не общались!</div>
            </div>
        </div>
        <div class="right-bar">
            <template v-if="currentDialog">
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
                <Dialog @load-more="loadMoreMessages" :dialog="currentDialog" />
                <div @drop.prevent.stop="receiveFiles" class="bottom-box">
                    <div v-if="!!draftMessage?.files?.length" class="attachments">
                        <HorizontalScroll :count="draftMessage.files.length">
                            <div class="files">
                                <div
                                    v-for="file in (draftMessage.files ?? [])"
                                    @click="draftsMessagesStore.removeFile(messengerStore.currentDialog, file)"
                                    class="file"
                                >
                                    <div class="trash">
                                        <GIcon fill :weight="700" :size=15>delete</GIcon>
                                    </div>
                                    <div :style="{ backgroundImage: `url(${getURLPreviewFile(file)})` }" class="img"></div>
                                </div>
                            </div>
                        </HorizontalScroll>
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
            </template>
            <template v-else>
                <div class="no-dialog">
                    <GIcon :size=80 :weight=300>forum</GIcon>
                    <div class="text" @click="openCreateDialogModal">Выберите или создайте новый чат</div>
                </div>
            </template>
        </div>

        <ImportantMsgModal v-if="isOpenImportantMsgModal" @on-close="closeImportantMsgModal" />
        <BlockedUsersModal v-if="isOpenBlockedUsersModal" @on-close="closeBlockedUsersModal" />
        <SettingsModal v-if="isOpenSettingsModal" @on-close="closeSettingsModal" />
        <DialogInfoModal v-if="isOpenDialogInfoModal" @on-close="closeDialogInfoModal" />
        <CreateDialogModal v-if="isOpenCreateDialogModal" @on-close="closeCreateDialogModal" />
    </div>
</template>

<style scoped lang="scss">
.messenger {
    width: 1200px;
    display: flex;
    border: 1px solid $border_8;
    border-radius: 5px;
    padding: 0;
    // это нужно убрать после того как закончу разработку чата
    margin: 40px auto 0;
    height: 650px; // эту тему нужно будет менять

    .left-bar {
        flex: 0.5;
        border-right: 1px solid $primary_border;
        display: flex;
        flex-direction: column;
        padding-right: 5px;
        .top-menu {
            padding: 10px 5px 0 10px;
            .search {
                display: flex;
                position: relative;
                // border-bottom: 2px solid $border_2;
                &:hover {
                    input {
                        border-color: $border_8;
                        transition: 200ms;
                        color: $white;
                        &::placeholder {
                            color: $gray;
                            transition: 200ms;
                        }
                    }
                }
                input {
                    margin-bottom: 10px;
                    border-radius: 10px;
                    outline: none;
                    flex: 1;
                    padding: 13px 20px 13px 46px;
                    background-color: $transparent_hover_background;
                    color: $gray;
                    border: 1px solid $primary_border;
                    transition: 200ms;
                    &::placeholder {
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        color: $gray_1;
                        transition: 200ms;
                    }
                }
                &-btn {
                    position: absolute;
                    cursor: pointer;
                    background-color: transparent;
                    border: none;
                    top: 12px;
                    padding: 0;
                    transition: 1.2s;
                    left: 13px;
                    width: fit-content;
                    height: fit-content;
                    &:hover {
                        transform: rotate(90deg);
                        transition: 1.2s;
                        .icon {
                            color: $gray;
                        }
                    }
                    .icon {
                        color: $gray_1;
                    }
                }
            }

            .options {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                .right, .left {
                    display: flex;
                }
                button {
                    background-color: $transparent_button_hover_1;
                    padding: 5px;
                    border-radius: 15px;
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    // transform: scale(0.99);
                    &:hover {
                        background-color: $transparent_button_hover;
                        // transform: scale(1.1);
                        .icon {
                            color: $gray;
                        }
                    }
                    .icon {
                        color: $gray_1;
                        font-size: 20px;
                    }
                }
            }
        }
        .dialogs {
            overflow-y: auto;
            padding: 0 3px 0 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            .no-dialogs {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                color: $gray_1;
                font-size: 14px;
            }
        }
    }
    .right-bar {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 70%;
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
                overflow: auto;
                padding: 5px 0;
                margin-bottom: 15px;
                &::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
                .files {
                    display: flex;
                    .file {
                        width: 80px;
                        height: 80px;
                        margin-left: 10px;
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
        .no-dialog {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .icon {
                color: $border; // цвет кнш да
            }
            .text {
                color: $border;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 200px;
                text-align: center;
            }
        }
    }
}
</style>