<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";

const userData = reactive({
    pass: "", email: "", userName: ""
})
const ui = reactive({
    isVisiblePass: false,
})

const isValidData = computed(() => !(!!userData.email?.trim().length))
const sendData = () => {
    
}


definePageMeta({
    requredAuth: false,
    name: ROUTES.LOGIN,
    layout: false
})
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
                <div class="login__container__rigth__top_box">
                    <Logo :size=50 />
                    <div class="info_box">
                        Введи свою почту
                        <span>Ваша почта будет использоватся для входа в аккаунт</span>
                    </div>
                </div>
                <div class="login__container__rigth__center_box">
                    <input type="text" v-model="userData.email" placeholder="Введите email"> 
                    <!--
                        <input type="text" v-model="userData.userName" placeholder="Как тебя зовут?">
                        <div class="password_input">
                            <input :type="ui.isVisiblePass ? `text` : `password`" v-model="userData.pass" placeholder="Придумайте пароль">
                            <button @click="() => ui.isVisiblePass = !ui.isVisiblePass">
                                <span class="material-symbols-rounded">
                                    {{ ui.isVisiblePass ? `visibility_off` : `visibility` }}
                                </span>
                            </button>
                        </div>
                    -->
                </div>
                <div class="login__container__rigth__footer_box">
                    <button :disabled="isValidData" @click="sendData">Продолжить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
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
            &__top_box {
                display: flex;
                justify-content: center;
                width: 100%;
                margin-bottom: 20px;
                flex-wrap: wrap;
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
            &__center_box {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
                span {
                    color: red;
                }
                input {
                    background: $primary_content_background;
                    border: 1px solid $primary_border;
                    color: $white;
                    padding: 9px 15px;
                    border-radius: 8px;
                    font-size: 15px;
                    margin: 4px 0;
                    transition: 100ms;
                    width: 100%;
                    &:hover, &:focus {
                        border-color: $border_1;
                        transition: 100ms;
                    }
                }
                .password_input {
                    position: relative;
                    display: flex;
                    justify-content: end;
                    align-items: center;
                    width: 100%;
                    input {
                        padding-right: 40px;
                    }
                    button {
                        right: 10px;
                        position: absolute;
                        background-color: transparent;
                        border: 0px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        span {
                            color: $gray;
                            font-size: 20px;
                            font-weight: 300;
                        }
                    }
                }
            }
            &__footer_box {
                display: flex;
                align-items: center;
                justify-content: center;
                button {
                    background-color: $white;
                    width: 100%;
                    border-radius: 8px;
                    padding: 7px 0;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: 100ms;
                    &:disabled {
                        transition: 200ms;
                        color: $black;
                        cursor: default;
                        opacity: .6;
                    }
                }
            }
        }
    }
}
</style>