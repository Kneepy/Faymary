<template>
    <div class="header">
        <div class="header__container">
            <NuxtLink :to="{name: ROUTES.HOME}">
                <Logo :size=60 />
            </NuxtLink>
            <Button class="user__profile">
                <div class="user__profile__box">
                    <Avatar v-if="userStore.me.file_id" :href="userStore.me.file_id" :size=40 />
                    <span class="material-symbols-rounded">expand_more</span>
                </div>
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ROUTES } from '~~/assets/constants/routes.constants';

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.header {
    height: 70px;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: $primary_content_background;
    border-bottom: 1px solid $primary_border;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .header__container {
        width: 1400px;
        margin: 0 auto;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: space-between;
        .user__profile {
            height: 100%;
            width: fit-content;
            background-color: transparent;
            border-radius: 0px;
            padding: 10px;
            &:hover {
                background-color: $transperent_hover_content_background;
            }
            &__box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                    margin-left: 10px;
                    font-size: 30px;
                    color: $gray;
                }
            }
        }
    }
}
</style>