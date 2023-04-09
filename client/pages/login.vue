<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requredAuth: false,
    layout: false
})
useHead({
    title: "Регистрация | FY Cloud",
})
const appState = useAppStateStore()
const getBackPage = () => useRouter().go(-1)
</script>

<template>
    <div class="login">
        <div class="login__container">
            <div class="login__container__left">
                <div class="login__container__left__top__box">
                    <Logo :size=35 />
                    <span class="noselect">Cloud</span>
                </div>
                <div class="login__container__left__center__box">
                    <span>Присоединяйся к Famyary через FY Cloud</span>
                </div>
                <div class="login__container__left__footer__box">
                    <div class="why__we__item">
                        <span class="material-symbols-rounded">
                            login
                        </span>
                        Быстрый вход в одно нажатие
                    </div>
                    <div class="why__we__item">
                        <span class="material-symbols-rounded">
                            person
                        </span>
                        Единый аккаунт для экосистемы FY Cloud
                    </div>
                    <div class="why__we__item">
                        <span class="material-symbols-rounded">
                            lock
                        </span>
                        Надёжная защита с поддержкой 2FA
                    </div>
                </div>
            </div>
            <div class="login__container__rigth">
                <Loader v-if="appState.load" />
                <div class="login__container__rigth__top_box">
                    <Button @click="getBackPage" v-if="$route.name !== ROUTES.LOGIN_INPUT_EMAIL">
                        <span class="material-symbols-rounded">keyboard_backspace</span>
                    </Button>
                    <Logo :size=50 />
                </div>
                <div class="login__container__rigth__center_box">
                    <NuxtPage page-key="some" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    &__container {
        width: 700px;
        background-color: transparent;
        border-radius: 10px;
        border: 1px solid $primary_border;
        position: relative;
        display: flex;
        overflow: hidden;
        &__left, &__rigth {
            width: 50%;
            padding: 30px;
        }
        &__left {
            background-color: $primary_content_background;
            &__top__box {
                display: flex;
                align-items: center;
                width: 90px;
                justify-content: space-between;
                font-weight: bold;
                color: $white;
                font-size: 19px;
                margin-bottom: 10px;
            }
            &__center__box {
                color: $white;
                font-size: 17px;
                width: 190px;
                margin-bottom: 10px;
                font-weight: lighter;
            }
            &__footer__box {
                span {
                    color: $gray;
                    font-size: 32px;
                    font-weight: 300;
                    margin-right: 21px;
                }
                .why__we__item {
                    display: flex;
                    align-items: center;
                    justify-content: left;
                    height: 60px;
                    font-size: 16px;
                    color: $gray;
                }
            }
        }
        &__rigth {
            position: relative;
            &__top_box {
                display: flex;
                justify-content: center;
                width: 100%;
                flex-wrap: wrap;
                
                button {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    left: 10px;
                    top: 10px;
                    border-radius: 50%;
                    background-color: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:hover {
                        background-color: $transperent_hover_background;
                        transition: 100ms;
                    }
                    span {
                        color: $gray;
                        font-size: 28px;
                    }
                }
                .info_box {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    color: $white;
                    font-size: 20px;
                    font-weight: 500;
                    margin-top: 10px;
                    span {
                        margin-top: 5px;
                        text-align: center;
                        color: $gray;
                        font-size: 15px;
                    }
                }
            }
        }
    }
}
</style>