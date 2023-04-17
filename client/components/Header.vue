<script setup>
import { ROUTES } from '~~/assets/constants/routes.constants';

const userStore = useUserStore()
const visibleUserMenu = ref(false)
const visibleNotificationsMenu = ref(false)
const visibleChangeAccountModal = ref(false)
const toggleUserMenu = () => visibleUserMenu.value = !visibleUserMenu.value
const toggleNotificationsMenu = () => visibleNotificationsMenu.value = !visibleNotificationsMenu.value
const toggleChangeAccount = () => visibleChangeAccountModal.value = !visibleChangeAccountModal.value
</script>
<template>
    <div class="header">
        <div class="header__container">
            <div class="header__container__left">
                <NuxtLink class="header__container__left__logo noselect" :to="{name: ROUTES.HOME}">
                    <Logo :size=45 />
                    <span>FAYMARY</span>
                </NuxtLink>
            </div>
            <div class="header__container__right">
                <div class="notifications" v-click-outside="() => visibleNotificationsMenu = false">
                    <Button @click="toggleNotificationsMenu" :class="{active: visibleNotificationsMenu}" class="notifications__bth">
                        <span class="material-symbols-rounded">notifications</span>
                    </Button>
                    <NotificationsMenu @close="toggleNotificationsMenu" v-if="visibleNotificationsMenu" />
                </div>
                <div class="header__container__right__user" v-click-outside="() => visibleUserMenu = false">
                    <Button @click="toggleUserMenu" class="user__profile" :class="{active: visibleUserMenu}">
                        <div class="user__profile__box">
                            <Avatar :href="userStore.me.file_id" :size=40 />
                            <span class="material-symbols-rounded">expand_more</span>
                        </div>
                    </Button>
                    <UserMenu @change-account="toggleChangeAccount" @destroy="toggleUserMenu" v-if="visibleUserMenu" />
                    <ChangeAccount @on-close="toggleChangeAccount" v-if="visibleChangeAccountModal" />
                </div>
            </div>
        </div>
    </div>
</template>

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
    z-index: 100;
    .header__container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: space-between;
        position: relative;
        &__left {
            display: flex;
            height: 100%;
            align-items: center;
            &__logo {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    margin-left: 10px;
                    font-weight: 600;
                    color: $white;
                }
            }
            .search {
                position: relative;
                padding-left: 50px;
                &__bth {
                    position: absolute;
                    width: 40px;
                    height: 100%;
                    background-color: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span {
                        color: $gray;
                        font-size: 20px;
                    }
                }
                input {
                    padding: 7px 15px;
                    padding-left: 35px;
                    width: 220px;
                    border-radius: 10px;
                    border: 1px solid $border_1;
                    background-color: $panel_background;
                    color: $white;
                }
            }
        }
        &__right {
            height: 100%;
            display: flex;
            .notifications {
                height: 100%;
                position: relative;
                margin-right: 10px;
                &__bth {
                    width: 55px;
                    height: 100%;
                    background-color: transparent;
                    border-radius: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 20px;
                    &:hover {
                        background-color: $transparent_button_hover;
                    }
                    &.active {
                        background-color: $transparent_button_hover;
                        span {
                            font-variation-settings: 'FILL' 1;
                        }
                    }
                    span {
                        color: $gray;
                    }
                }
            }
            &__user {
                height: 100%;
                .user__profile {
                    height: 100%;
                    width: fit-content;
                    background-color: transparent;
                    border-radius: 0px;
                    padding: 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &:hover {
                        background-color: $transparent_button_hover;
                    }
                    &.active {
                        background-color: $transparent_button_hover;
                    }
                    &__box {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        span {
                            margin-left: 10px;
                            font-size: 20px;
                            color: $gray;
                        }
                    }
                }
            }
        }
    }
}
</style>