<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

const emit = defineEmits(["destroy", "change-account"])
const userStore = useUserStore()
const appStore = useAppStateStore()
const closeMenu = () => emit(`destroy`)
const changeAccount = () => {
    emit(`change-account`)
    closeMenu()
}
</script>
<template>
    <div class="user_menu">
        <div class="user_menu_container">
            <Button @click="closeMenu" class="user_menu_container__box">
                <Avatar :href="userStore.me.file_id" :size=40 />
                <div class="user_info">
                    <div class="name">{{ userStore.me.fullName }}</div>
                    <div class="id">@{{ userStore.me.userName }}</div>
                </div>
                <span class="material-symbols-rounded">chevron_right</span>
            </Button>
            <Button @click="changeAccount" class="user_menu_container__change_account">
                <span class="material-symbols-rounded">cached</span>
                Сменить учётную запись
            </Button>
        </div>
        <div class="user_menu__options">
            <NuxtLink :to="{name: ROUTES.SETTINGS}" @click="closeMenu">
                <Button class="option">
                    <span class="material-symbols-rounded">settings</span>
                    Настройки
                </Button>
            </NuxtLink>
            <NuxtLink :to="{name: ROUTES.SUPPORT}" @click="closeMenu">
                <Button class="option">
                    <span class="material-symbols-rounded">info</span>
                    Помощь
                </Button>
            </NuxtLink>
            <NuxtLink :to="{name: ROUTES.LOGIN_INPUT_EMAIL, query: {authorization: appStore.authorization}}" @click="closeMenu">
                <Button class="option logout">
                    <span class="material-symbols-rounded">logout</span>
                    Выход
                </Button>
            </NuxtLink>
        </div>
    </div>
</template>
<style scoped lang="scss">
.user_menu {
    position: absolute;
    right: 0;
    background-color: $primary_content_background;
    border: 1px solid $primary_border;
    border-radius: 10px;
    width: 280px;
    &_container {
        padding: 12px;
        &__box {
            display: flex;
            align-items: center;
            padding: 12px;
            background-color: $panel_background;
            border-radius: 10px 10px 0px 0px;
            text-align: inherit;
            &:hover {
                background-color: rgb(73 73 73);
            }
            .user_info {
                display: flex;
                flex-direction: column;
                margin-left: 12px;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .name {
                    color: $white;
                    font-weight: 500;
                }
                .id {
                    color: $gray;
                    font-size: 14px;
                    font-weight: 700;
                }
                
            }
            span { 
                color: $gray;
            }
        }
        &__change_account {
            display: flex;
            align-items: center;
            padding: 12px;
            background-color: $panel_background;
            border-radius: 0px 0px 10px 10px;
            text-align: inherit;
            border-top: 1px solid $border_1;
            color: $gray;
            font-size: 14px;
            &:hover {
                background-color: rgb(73 73 73);
            }
            span {
                font-size: 18px;
                font-weight: 300;
                margin-right: 10px;
            }
        }
    }
    &__options {
        width: 100%;
        &::before {
            content: "";
            width: 100%;
            height: 1px;
            background-color: $border_1;
        }
        .option {
            width: 100%;
            border-radius: 1px;
            margin-bottom: 0px;
            background-color: transparent;
            color: $white;
            font-size: 14px;
            text-align: left;
            padding: 9px 12px;
            display: flex;
            align-items: center;
            &:hover {
                background-color: $transperent_hover_content_background;
            }
            &.logout {
                color: $red;
                font-weight: bold;
                span {
                    color: $red;
                    font-weight: normal;
                }
            }
            span {
                color: $gray;
                font-size: 22px;
                margin-right: 10px;
            }
        }
    }
}
</style>