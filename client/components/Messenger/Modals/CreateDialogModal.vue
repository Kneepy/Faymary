<script setup lang="ts">
import { UserAPI } from "~/api";
import { type CreateDialog, useCreateDialogStore } from "~/store/messenger";
import type { ChangeEvent } from "rollup";

const emit = defineEmits(["onClose"])
const close = () => emit("onClose")

const createDialogStore = useCreateDialogStore()

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
        const users = await UserAPI.getUsersBy({ fullName: value })

        createDialogStore.setResultSearch(users)
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
const checkUserIsSelected = (user: CreateDialog.IUser): boolean => createDialogStore.selectedUsers.indexOf(user) !== -1
const toggleSelectUser = (user: CreateDialog.IUser): void => {
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
const clickAttachFile = () => inputFile.value.click()
const getFiles = (e: Event) => {
    console.log(e.target.files)
}
</script>

<template>
    <ModalBox @on-close="close">
        <div class="create-dialog">
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
                <div v-if="createDialogStore.resultSearch.length <= 0 && !isLoading" class="none">Мы не неашли пользователя с таким именем</div>
                <SkeletonLoader
                    v-if="isLoading"
                    :count=2
                />
                <div
                    v-for="(user, key) in createDialogStore.resultSearch"
                    @click="() => toggleSelectUser(user)"
                    :key="key"
                    :class="[`user`, checkUserIsSelected(user) ? `active` : ``]"
                    v-else
                >
                    <div class="user-info">
                        <Avatar :size=40 :user-name="user.fullName" :href="user.file_id" />
                        <div class="user-name">
                            {{ user.fullName }}
                            <div class="user-id">@{{ user.userName }}</div>
                        </div>
                    </div>
                    <span v-if="checkUserIsSelected(user)" class="material-symbols-rounded">check</span>
                </div>
            </div>

            <div
                v-if="() => {
                    !!createDialogStore.selectedUsers.length
                    return true
                }"
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
                <div class="input-message">
                    <IconButton>
                        <GIcon @click="clickAttachFile" style="transform: rotate(30deg)">attach_file</GIcon>
                        <input
                            @change="getFiles"
                            ref="inputFile"
                            type="file"
                            accept="image/*"
                        >
                    </IconButton>
                    <TextareaAutosize class="scroll" placeholder="Напишите своим новым собеседникам!" :max-height=350 />
                    <IconButton>
                        <GIcon fill>family_star</GIcon>
                    </IconButton>
                    <IconButton>
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
    min-height: 30vh;
    background-color: $primary_content_background;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid $border_1;
    padding: 0 5px 0 5px;
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
        .user {
            display: flex;
            color: $white;
            align-items: center;
            cursor: pointer;
            padding: 10px 15px;
            margin-bottom: 10px;
            transition: 200ms;
            border-radius: 10px;
            justify-content: space-between;
            background-color: $transparent_button_hover_17;
            &:hover, &.active {
                background-color: $transparent_panel_hover;
                opacity: 1;
                transition: 200ms;
            }
            span {
                font-weight: 800;
                font-size: 20px;
                color: $white;
            }
            .user-info {
                display: flex;
                align-items: center;
                .user-name {
                    margin-left: 15px;
                    font-weight: bold;
                    font-size: 16px;
                    .user-id {
                        font-size: 14px;
                        font-weight: 600;
                        color: $gray;
                    }
                }
            }
        }
    }
    .selected-users {
        border-top: 1px solid $border_1;
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
                &:focus {
                    border: none;
                    outline: none;
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
}
</style>