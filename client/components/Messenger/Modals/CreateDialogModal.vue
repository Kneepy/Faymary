<script setup lang="ts">
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
</script>

<template>
    <ModalBox @on-close="close">
        <div class="create-dialog">
            <div class="title">Создание диалога</div>
            <div class="search-users">
                <input placeholder="Найдите новых собеседников!" type="text">
            </div>
            <div class="result-search scroll">
                <div
                    v-for="(i, key) in Array(20)"
                    @click="() => toggleSelectItem(key)"
                    :key="key"
                    :class="[`user`, checkIsSelectItem(key) ? `active` : ``]"
                >
                    <div class="user-info">
                        <Avatar :size=40 :user-name="`Alex Korf`" />
                        <div class="user-name">
                            Alex Korf
                            <div class="user-id">@Kneepy</div>
                        </div>
                    </div>
                    <span v-if="checkIsSelectItem(key)" class="material-symbols-rounded">check</span>
                </div>
            </div>
            <div v-if="!!selectedUsers.length" class="selected-users">
                <div class="title">Выбранные пользователи</div>
                <div class="users scroll">
                    <div
                        class="user"
                        v-for="(i, key) in selectedUsers"
                        @click="toggleSelectItem(i)"
                    >
                        <Avatar :size=20 :user-name="`Alex Korf`" />
                        <div class="user-name">Alex Korf</div>
                    </div>
                </div>
            </div>
        </div>
    </ModalBox>
</template>

<style scoped lang="scss">
.create-dialog {
    width: 520px;
    height: 600px;
    background-color: $primary_content_background;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid $border_1;
    padding: 0 5px 5px 5px;
    .title {
        padding: 20px 40px;
        color: $white;
        font-weight: bold;
        font-size: 18px;
    }
    .search-users {
        display: flex;
        border-bottom: 1px solid $primary_border;
        border-top: 1px solid $primary_border;
        margin-bottom: 10px;
        input {
            border: none;
            flex: 1;
            color: $white;
            padding: 15px 40px;
            font-size: 14px;
            background-color: transparent;
        }
    }
    .result-search {
        padding: 10px;
        flex: 1;
        overflow-y: auto;
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
                    font-size: 18px;
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
        }
        .users {
            display: flex;
            max-height: 80px;
            flex-wrap: wrap;
            overflow: auto;
            .user {
                display: flex;
                color: $white;
                padding: 5px 10px;
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
    }
}
</style>