<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_CHOSE_USER,
    middleware: ["presence-email"]
})
const { tempUser } = useUserStore()
</script>
<template>
    <div class="chose__user">
        <div class="info_box">
            Это ваш аккаунт?
            <span>Если это так то войдите в него</span>
        </div>
        <Button :disabled="false" class="user">
            <Avatar :size=50 :href="tempUser.file_id" />
            <div class="user__info">
                <div class="user__info__name">{{ tempUser.fullName }}</div>
                <div class="user__info__id">@{{ tempUser.userName }}</div>
            </div>
        </Button>
        <div class="answer">
            <Button class="answer__no">Нет</Button>
            <NuxtLink :to="{name: ROUTES.LOGIN_INPUT_DATA, query: {exists: true as any}}">
                <Button class="answer__yes">Да</Button>
            </NuxtLink>
        </div>
    </div>
</template>
<style scoped lang="scss">
.chose__user {
    .info_box {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        color: $white;
        font-size: 20px;
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 30px;
        span {
            margin-top: 5px;
            text-align: center;
            color: $gray;
            font-size: 15px;
        }
    }
    .user {
        display: flex;
        align-items: center;
        background-color: $primary_content_background;
        padding: 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: 200ms;
        opacity: .8;
        width: 100%;
        border: none;
        &:hover {
            transition: 200ms;
            opacity: 1;
        }
        &__info {
            margin-left: 10px;
            font-size: 16px;
            color: $white;
            &__name {
                font-weight: bold;
            }
            &__id {
                color: $gray;
                font-size: 14px;
                text-align: left;
            }
        }
    }
    .answer {
        display: flex;
        justify-content: space-around;
        margin-top: 40px;
        button {
            background-color: $white;
            border-radius: 8px;
            padding: 7px 0;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: 100ms;
            width: 120px;
            color: $white;
            opacity: 1;
            transition: 100ms;
            &:hover {
                opacity: .8;
                transition: 100ms;
            }
            &.answer__yes {
                background-color: $green;
            }
            &.answer__no {
                background-color: $red;
            }
        }
    }
}
</style>