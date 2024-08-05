<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";
import SettingsModal from "~/components/Messenger/Modals/SettingsModal.vue";
import BlockedUsersModal from "~/components/Messenger/Modals/BlockedUsersModal.vue";
import CreateDialogModal from "~/components/Messenger/Modals/CreateDialogModal.vue";
import { type Messenger, useMessengerStore } from "~/store/messenger";
import { DialogsAPI } from "~/api";
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
const userStore = useUserStore()
const messagesBoxRef = ref<HTMLBaseElement>()
const isLoading = ref(false)

onMounted(async () => {
    // получаем все переписки пользователя и заносим их в состояние
    isLoading.value = true

    const userDialogs = await DialogsAPI.getUserDialogs({take: 10, skip: 0}) ?? []
    messengerStore.addDialogs(<Messenger.CustomDialog[]> userDialogs)

    isLoading.value = false
})

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

watch(() => messengerStore.currentDialog, async (dialog_id) => {
    if (!dialog_id) return

    const messages = await DialogsAPI.getDialogMessages(dialog_id, { take: 20, skip: 0 })
    messengerStore.addMessagesDialog(dialog_id, messages)

    // это чтобы при открытии блока с сообщениями прокуртка была внизу блока а не вверху
    messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
})
const currentDialog = computed(() => messengerStore.dialogs?.find(v => v.id === messengerStore.currentDialog))
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
                <template v-if="!isLoading">
                    <DialogCard
                        v-for="(dialog, key) in messengerStore.dialogs"
                        @click="messengerStore.changeCurrentDialog(dialog.id)"
                        :dialog
                        :key
                    />
                </template>
                <SkeletonDialogBlock v-if="messengerStore.dialogs?.length === 0 && isLoading" />
                <div v-if="messengerStore.dialogs?.length === 0 && !isLoading" class="no-dialogs">Пока вы ещё ни с кем не общались!</div>
            </div>
        </div>
        <div class="right-bar">
            <template v-if="currentDialog">
                <div class="top-box">
                    <div class="user-info" @click="openDialogInfoModal">
                        <div class="user-name">Alex Korf</div>
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
                <div class="wrapper">
                    <div class="messages scroll" ref="messagesBoxRef">
                        <Message v-for="message in currentDialog.messages" :message="message" :own="message.user.id === userStore.me.id" />
                    </div>
                </div>
                <div class="bottom-box">
                    <IconButton :size=42>
                        <GIcon style="transform: rotate(30deg)" fill :size=22>attach_file</GIcon>
                    </IconButton>
                    <TextareaAutosize class="scroll" placeholder="Напишите что-нибудь!"/>
                    <IconButton :size=42>
                        <GIcon fill :size=22>family_star</GIcon>
                    </IconButton>
                    <IconButton :size=42>
                        <GIcon fill :size=22>play_arrow</GIcon>
                    </IconButton>
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
    height: 605px; // эту тему нужно будет менять

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
        .wrapper {
            padding: 5px 5px 5px 0;
            flex: 1;
            display: flex;
            .messages {
                display: flex;
                flex-direction: column;
                padding: 0 10px;
                max-height: 450px;
                overflow-y: auto;
                flex: 1;
                padding-bottom: 20px; // убрать позже
            }
        }
        .bottom-box {
            padding: 10px;
            display: flex;
            border-top: 1px solid $primary_border;
            align-items: center;
            button {
                background-color: $transparent_button_hover_1;
                margin: 0 5px;
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
            textarea {
                flex: 4;
                background-color: $transparent_hover_background;
                border-radius: 10px;
                color: $gray;
                border: 1px solid $primary_border;
                padding: 10px 20px;
                transition: 200ms;
                resize: none;
                overflow: hidden;
                height: 18px;
                max-height: 450px;
                &::placeholder {
                    color: $gray_1;
                    transition: 200ms;
                }
                &:focus {
                    outline: none;
                }
                &:hover, &:focus {
                    border-color: $border_8;
                    transition: 200ms;
                    color: $white;
                    &::placeholder {
                        color: $gray;
                        transition: 200ms;
                    }
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