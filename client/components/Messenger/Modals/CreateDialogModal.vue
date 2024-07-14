<script setup lang="ts">
import { type User, UserAPI } from "~/api";

const emit = defineEmits(["onClose"])
const close = () => emit("onClose")

const selectedUsers = ref<number[]>([])
const checkIsSelectItem = (key: number): boolean => selectedUsers.value.indexOf(key) !== -1
const toggleSelectItem = (key: number): void => {
    const indexItem = selectedUsers.value.indexOf(key)

    if (indexItem === -1) {
        selectedUsers.value.push(key)
        return
    }

    selectedUsers.value.splice(indexItem, 1)
}

const isOpenSelectedUsersPanel = ref(true)
const toggleSelectedUsersPanel = () => isOpenSelectedUsersPanel.value = !isOpenSelectedUsersPanel.value

/**
 * Реализация поиска пользователей
 * Которые будут участвовать в новом диалоге
 */
const inputValue = ref("")
const resultSearch = ref<User[]>([])
const isLoading = ref(false)
let debounceTimeout = null

watch(inputValue, async value => {
    isLoading.value = true

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        const users = [] //await UserAPI.getUsersBy({fullName: value})
        resultSearch.value = [...users]

        isLoading.value = false
    }, 500)
})
</script>

<template>
    <ModalBox @on-close="close">
        <div class="create-dialog">
            <div class="header">
                <div class="title">Создание диалога</div>
                <button @click="close">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
            <div class="search-users">
                <input v-model="inputValue" placeholder="Найдите новых собеседников!" type="text">
            </div>
            <div class="result-search scroll">
                <div v-if="resultSearch.length <= 0 && !isLoading" class="none">Мы не неашли пользователя с таким именем</div>
                <Loader v-if="isLoading" />
                <SkeletonLoader />
                <div
                    v-for="(user, key) in resultSearch"
                    @click="() => toggleSelectItem(key)"
                    :key="key"
                    :class="[`user`, checkIsSelectItem(key) ? `active` : ``]"
                >
                    <div class="user-info">
                        <Avatar :size=40 :user-name="user.fullName" :href="user.file_id" />
                        <div class="user-name">
                            {{ user.fullName }}
                            <div class="user-id">@{{ user.userName }}</div>
                        </div>
                    </div>
                    <span v-if="checkIsSelectItem(key)" class="material-symbols-rounded">check</span>
                </div>
            </div>

            <div v-if="!!selectedUsers.length" class="selected-users noselect">
                <div class="title" @click="toggleSelectedUsersPanel">
                    Выбранные пользователи
                    <button :class="[isOpenSelectedUsersPanel ? `open` : `close`]">
                        <span class="material-symbols-rounded">chevron_right</span>
                    </button>
                </div>
                <Transition name="folding">
                    <div v-if="isOpenSelectedUsersPanel" class="users scroll">
                        <div
                            class="user"
                            v-for="(i, key) in selectedUsers"
                            @click="toggleSelectItem(i)"
                        >
                            <Avatar :size=20 :user-name="`Alex Korf`" />
                            <div class="user-name">Alex Korf</div>
                        </div>
                    </div>
                </Transition>
                <div class="input-message">
                    <button>
                        <span class="material-symbols-rounded" style="transform: rotate(30deg)">attach_file</span>
                    </button>
                    <TextareaAutosize class="scroll" placeholder="Напишите своим новым собеседникам!" :max-height=350 />
                    <button>
                        <span class="material-symbols-rounded">family_star</span>
                    </button>
                    <button>
                        <span class="material-symbols-rounded">play_arrow</span>
                    </button>
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
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            border: none;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            transition: 200ms;
            flex: 0;
            &:hover {
                background-color: $transparent_button_hover_17;
                transition: 200ms;
                span {
                    color: $white;
                    transition: 200ms;
                }
            }
            span {
                color: $gray;
                font-weight: 500;
                transition: 200ms;
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
            padding: 10px 20px;
            margin-bottom: 10px;
            opacity: .8;
            transition: 200ms;
            border-radius: 10px;
            justify-content: space-between;
            &:hover, &.active {
                background-color: $transparent_button_hover_17;
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
            button {
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 30px;
                background-color: transparent;
                cursor: pointer;
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
                    font-weight: bold;
                    font-size: 20px;
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
            padding: 10px 20px;
            button {
                background-color: transparent;
                outline: none;
                border: none;
                padding: 9px;
                height: fit-content;
                cursor: pointer;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 0;
                &:hover {
                    background-color: $transparent_button_hover_1;
                }
                &:last-child {
                    margin-left: 5px;
                }
                span {
                    font-variation-settings: "FILL" 1;
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