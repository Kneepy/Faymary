<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";
import SettingsModal from "~/components/Messenger/Modals/SettingsModal.vue";
import BlockedUsersModal from "~/components/Messenger/Modals/BlockedUsersModal.vue";
import CreateDialogModal from "~/components/Messenger/Modals/CreateDialogModal.vue";
import Dialog from "~/components/Messenger/Dialog.vue"
import { type Messenger, useMessengerStore, useDraftsMessagesStore, DraftsMessages } from "~/store/messenger";
import { DialogsAPI, DialogsWsAPI, MessagesWsAPI } from "~/api";
import SkeletonDialogBlock from "~/components/Messenger/Cards/SkeletonDialogCard.vue";

definePageMeta({
    requiredAuth: true, // это только на время разработки, так должно быть true
    name: ROUTES.MESSENGER,
    layout: false // только на время разработки, но в обычное время default или просто удалить layout
})
useHead({
    title: "Сообщения"
})

const messengerStore = useMessengerStore()

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
const isOpenCreateDialogModal = ref(false)
const openCreateDialogModal = () => isOpenCreateDialogModal.value = true
const closeCreateDialogModal = () => isOpenCreateDialogModal.value = false

// маркер показывающий загружены ли диалоги
const isLoadingDialogs = ref(false)

onMounted(async () => {
    // получаем все переписки пользователя и заносим их в состояние
    isLoadingDialogs.value = true

    const userDialogs = await DialogsAPI.getUserDialogs({take: 10, skip: 0}) ?? []
    messengerStore.addDialogs(<Messenger.Dialog[]> userDialogs)

    isLoadingDialogs.value = false
})

DialogsWsAPI.listenNewDialogs(dialog =>
    messengerStore.addDialogs([ dialog ])
)
DialogsWsAPI.listenNewMessages(message =>
    messengerStore.insertMessagesDialog(message.dialog_id, [ message ])
)
DialogsWsAPI.listenUpdatedMessages(message =>
    messengerStore.updateMessageDialog(message)
)
MessagesWsAPI.listenNewReactions(({ message, like }) =>
    messengerStore.insertLikeMessage(message, like)
)
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
            <Dialog v-if="messengerStore.currentDialog" />
            <div v-else class="no-dialog">
                <GIcon :size=80 :weight=300>forum</GIcon>
                <div class="text" @click="openCreateDialogModal">Выберите или создайте новый чат</div>
            </div>
        </div>

        <ImportantMsgModal v-if="isOpenImportantMsgModal" @on-close="closeImportantMsgModal" />
        <BlockedUsersModal v-if="isOpenBlockedUsersModal" @on-close="closeBlockedUsersModal" />
        <SettingsModal v-if="isOpenSettingsModal" @on-close="closeSettingsModal" />
        <CreateDialogModal v-if="isOpenCreateDialogModal" @on-close="closeCreateDialogModal" />
    </div>
</template>

<style scoped lang="scss">
.messenger {
    width: 1400px;
    display: flex;
    border: 1px solid $border_8;
    border-radius: 5px;
    padding: 0;
    // это нужно убрать после того как закончу разработку чата
    margin: 40px auto 0;
    height: 650px; // эту тему нужно будет менять

    .left-bar {
        flex: 0.4;
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