<script setup lang="ts">
import { DialogsWsAPI, ParticipantRights, StoreAPI, DialogsAPI } from "~/api";
import {
    type CreateDialog,
    useCreateDialogStore,
    useMessengerStore,
    useDraftsMessagesStore,
    DraftsMessages
} from "~/store";
import { ReceiveFiles } from "assets/helpers/receive-files";

const emit = defineEmits(["onClose"])
const close = () => emit("onClose")

const createDialogStore = useCreateDialogStore()
const messengerStore = useMessengerStore()
const draftsMessagesStore = useDraftsMessagesStore()

/**
 * Реализация поиска пользователей
 * Которые будут участвовать в новом диалоге
 */
const isLoading = ref(false)
let debounceTimeout = null

watch(() => createDialogStore.inputSearch, async value => {
    isLoading.value = true

    // таймаут нужен чтобы оптимизировать работу живого поиска
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(async () => {
        const { existing, nonexistent } = await DialogsAPI.searchUsersFromDialogs({ fullName: value, take: 10, skip: 0 })
        createDialogStore.setResultSearch({ existing: existing ?? [], nonexistent: nonexistent ?? [] })

        isLoading.value = false
    }, 500)
})

/**
 * Выбор пользователей из результатов поиска
 */
// панелька показывающая выбранных пользователей
const isOpenSelectedUsersPanel = ref(true)
const toggleSelectedUsersPanel = () => isOpenSelectedUsersPanel.value = !isOpenSelectedUsersPanel.value

// сами выбранные пользователи
const checkUserIsSelected = (user: CreateDialog.User): boolean => createDialogStore.selectedUsers.indexOf(user) !== -1
const toggleSelectUser = (user: CreateDialog.User): void => {
    const indexItem = createDialogStore.selectedUsers.indexOf(user)

    if (indexItem === -1) {
        createDialogStore.selectUser(user)

        return
    }

    createDialogStore.removeUserByIndex(indexItem)
}

/**
 * Штука для получения файла и прикрепления его к сообщению
 */
const inputFile = ref<HTMLInputElement>(null)
const draftMessage = reactive(draftsMessagesStore.getDraft(DraftsMessages.ANONYMOUS_DIALOG))

const clickAttachFile = () => inputFile.value.click()
const receiveFiles = (e: Event) => {
    const files = ReceiveFiles(e)

    for (const file of files) {
        draftsMessagesStore.addFile(DraftsMessages.ANONYMOUS_DIALOG, file)
    }
}
const getURLPreviewFile = (file: File) => URL.createObjectURL(file)

/**
 * Обработка на нажатие кнопки отправки
 * Тут надо сделать переключатель типа создать беседу или отправить каждому отдельно, но я для теста пока так оставлю
 */
const sendMessage = async () => {
    // создаём чат
    const participants = createDialogStore.selectedUsers.map(user => ({ user_id: user.id, rights: ParticipantRights.USER }))
    const name = participants.length > 2 ? "Test Dialog" : ""
    const dialog = await DialogsWsAPI.createDialog({ participants, name })
    const message = await DialogsWsAPI.createMessage(await draftsMessagesStore.prepareMessage(DraftsMessages.ANONYMOUS_DIALOG, { dialog_id: dialog.id }))

    messengerStore.addDialogs([ dialog ])
    messengerStore.insertMessagesDialog(dialog.id, [ message ])

    // переводим пользователя в новый чат
    messengerStore.changeCurrentDialog(dialog.id)
    draftsMessagesStore.clear(DraftsMessages.ANONYMOUS_DIALOG)
    createDialogStore.clear()
    close()
}
</script>
<template>
    <ModalBox @on-close="close">
        <div
            @drop.stop.prevent="receiveFiles"
            @dragover.stop.prevent
            class="create-dialog"
        >
            <div class="header">
                <div class="title">Создание диалога</div>
                <IconButton @click="close">
                    <GIcon :weight=500>close</GIcon>
                </IconButton>
            </div>
            <div class="search-users">
                <input v-model="createDialogStore.inputSearch" placeholder="Найдите новых собеседников!" type="text">
            </div>
            <div class="result-search scroll">
                <div
                    v-if="
                        createDialogStore.resultSearch.nonexistent.length <= 0 &&
                        createDialogStore.resultSearch.existing.length <= 0 &&
                        !isLoading
                    "
                    class="none"
                >Мы не неашли пользователя с таким именем</div>
                <div v-if="!!createDialogStore.resultSearch.existing?.length && !isLoading" class="result-type"><span>Вы уже общались</span></div>
                <SkeletonResultSearchUserCard v-if="isLoading" />
                <ResultSearchUserCard
                    v-for="(user, key) in createDialogStore.resultSearch.existing"
                    :user="user as any"
                    :is-select="checkUserIsSelected(user)"
                    @click="() => toggleSelectUser(user)"
                    :key="key"
                    v-else
                />
                <div v-if="!!createDialogStore.resultSearch.nonexistent?.length && !isLoading" class="result-type"><span>Общение с ними можно начать</span></div>
                <ResultSearchUserCard
                    v-for="(user, key) in createDialogStore.resultSearch.nonexistent"
                    :user="user as any"
                    :is-select="checkUserIsSelected(user)"
                    @click="() => toggleSelectUser(user)"
                    :key="key"
                    v-if="!isLoading"
                />
            </div>
            <div
                v-if="!!createDialogStore.selectedUsers.length"
                class="selected-users noselect"
            >
                <div class="title" @click="toggleSelectedUsersPanel">
                    Выбранные пользователи
                    <IconButton :class="[isOpenSelectedUsersPanel ? `open` : `close`]">
                        <GIcon :size=20 :weight=700>chevron_right</GIcon>
                    </IconButton>
                </div>
                <Transition name="folding">
                    <div v-if="isOpenSelectedUsersPanel" class="users scroll">
                        <div
                            class="user"
                            v-for="(user, key) in createDialogStore.selectedUsers"
                            :key="key"
                            @click="toggleSelectUser(user)"
                        >
                            <Avatar :size=20 :user-name="user.fullName" :href="user.file_id" />
                            <div class="user-name">{{ user.fullName }}</div>
                        </div>
                    </div>
                </Transition>
                <div class="attachments">
                    <HorizontalScroll :count="draftMessage.files.length">
                        <div class="files">
                            <div
                                v-for="file in (draftMessage.files ?? [])"
                                @click="() => draftsMessagesStore.removeFile(DraftsMessages.ANONYMOUS_DIALOG, file)"
                                class="file"
                            >
                                <div
                                    :style="{
                                    backgroundImage: `url(${getURLPreviewFile(file)})`
                                }"
                                    class="img"
                                >
                                </div>
                                <div class="remove">
                                    <GIcon :size=15 fill>delete</GIcon>
                                </div>
                            </div>
                        </div>
                    </HorizontalScroll>
                </div>
                <div class="input-message">
                    <IconButton>
                        <GIcon @click="clickAttachFile" style="transform: rotate(30deg)">attach_file</GIcon>
                        <input
                            @input="receiveFiles"
                            ref="inputFile"
                            type="file"
                            accept="image/*"
                            multiple
                        >
                    </IconButton>
                    <TextareaAutosize
                        class="scroll"
                        placeholder="Напишите своим новым собеседникам!"
                        @change="(v: string) => draftsMessagesStore.setMessage(DraftsMessages.ANONYMOUS_DIALOG, v)"
                        :value="draftMessage.message"
                        :max-height=350
                    />
                    <IconButton>
                        <GIcon fill>family_star</GIcon>
                    </IconButton>
                    <IconButton @click="sendMessage">
                        <GIcon fill>play_arrow</GIcon>
                    </IconButton>
                </div>
            </div>
        </div>
    </ModalBox>
</template>

<style scoped lang="scss">
.create-dialog {
    width: 520px;
    max-height: 90vh;
    min-height: 395px;
    background-color: $primary_content_background;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid $border_8;
    padding: 0 5px 0 5px;
    position: relative;
    overflow: hidden;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 40px;
        .title {
            color: $white;
            font-weight: 600;
            font-size: 18px;
        }
        button {
            background-color: transparent;
            flex: 0;
            &:hover {
                background-color: $transparent_button_hover_17;
                .icon {
                    color: $white;
                }
            }
            .icon {
                color: $gray;
            }
        }
    }
    .search-users {
        display: flex;
        border-bottom: 1px solid $primary_border;
        border-top: 1px solid $primary_border;
        input {
            border: none;
            flex: 1;
            color: $white;
            padding: 15px 40px;
            font-size: 14px;
            background-color: transparent;
            &::placeholder {
                transition: 200ms;
            }
            &:hover {
                &::placeholder {
                    color: $gray;
                    transition: 200ms;
                }
            }
        }
    }
    .result-search {
        padding: 10px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        position: relative;
        .none {
            color: $gray_1;
            font-size: 14px;
            height: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .result-type {
            color: $border_8;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            span {
                margin: 0 10px;
            }
            &::after, &::before {
                content: "";
                height: 1px;
                background-color: $border_8;
                display: block;
            }
            &::after {
                flex: 1;
            }
            &::before {
                width: 40px;
            }
        }
    }
    .selected-users {
        border-top: 1px solid $border_8;
        .title {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            color: $white;
            opacity: .8;
            &:hover {
                opacity: 1;
            }
            button {
                background-color: transparent;
                transition: 100ms;
                flex: 0;
                &.open {
                    transform: rotate(90deg);
                    transition: 100ms;
                }
                &.close {
                    transform: rotate(0deg);
                    transition: 100ms;
                }
                span {
                    color: $white;
                }
            }
        }
        .users {
            display: flex;
            max-height: 80px;
            flex-wrap: wrap;
            overflow: auto;
            padding: 0 10px;
            .user {
                display: flex;
                color: $white;
                padding: 5px 10px 5px 5px;
                cursor: pointer;
                background-color: $transparent_panel_hover;
                align-items: center;
                justify-content: center;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin-right: 10px;
                margin-bottom: 10px;
                transition: 200ms;
                &:hover {
                    background-color: $transparent_panel_hover_8;
                    transition: 200ms;
                }
                .user-name {
                    margin-left: 5px;
                }
            }
        }
        .attachments {
            overflow-x: auto;
            padding: 5px 0;
            &::-webkit-scrollbar {
                width: 0;
                height: 0;
            }
            .files {
                display: flex;
                .file {
                    width: 60px;
                    height: 60px;
                    margin-left: 10px;
                    border-radius: 10px;
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
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
                        .remove {
                            opacity: 1;
                        }
                    }
                    .remove {
                        position: absolute;
                        right: 5px;
                        top: 5px;
                        display: flex;
                        align-items: center;
                        border-radius: 50%;
                        background-color: $white;
                        justify-content: center;
                        padding: 2px;
                        opacity: 0;
                        .icon {
                            color: $black;
                        }
                    }
                }
            }
        }
        .input-message {
            flex: 1;
            display: flex;
            padding: 10px;
            button {
                background-color: transparent;
                cursor: pointer;
                padding: 10px;
                flex: 0;
                &:hover {
                    background-color: $transparent_button_hover_1;
                }
                &:last-child {
                    margin-left: 5px;
                }
                span {
                    color: $gray;
                }
            }
            textarea {
                flex: 1;
                background-color: transparent;
                border: none;
                padding: 10px 20px;
                color: $white;
                border-radius: 10px;
                font-size: 16px;
                resize: none;
                max-height: 350px;
                &::placeholder {
                    color: $gray_1;
                    transition: 200ms;
                }
                &:focus {
                    border: none;
                    outline: none;
                }
                &:hover {
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
        .folding-enter-active {
            animation: folding 200ms;
        }
        .folding-leave-active {
            animation: folding 200ms reverse;
        }
        @keyframes folding {
            0% {
                max-height: 0;
                overflow: hidden;
            }
            100% {
                overflow: hidden;
            }
        }
    }
    .attach-file {
        background-color: $drop_file_background;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            flex: 1;
            .drop-file {
                border: 3px solid $gray;
                border-style: dashed;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                flex-direction: column;
                .icon {
                    color: $gray;
                }
                .text {
                    color: $gray;
                    font-size: 16px;
                    font-weight: 500;
                    width: 300px;
                    text-align: center;
                }
            }
        }
    }
}
</style>