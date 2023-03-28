<script setup lang="tsx">
import { ROUTES } from "~/assets/constants/routes.constants";

const page = reactive({
    inputEmail: true,
    choseUser: false,
    inputData: false,
    confirmEmail: false
})

definePageMeta({
    requredAuth: false,
    name: ROUTES.LOGIN,
    layout: false
})

const choseUser = (res: boolean) => {
    console.log(res)
}
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
                    <div class="info_box" v-if="page.inputEmail">
                        Введи свою почту
                        <span>Ваша почта будет использоватся для входа в аккаунт</span>
                    </div>
                    <div class="info_box" v-if="page.choseUser">
                        Это ваш аккаунт?
                        <span>Если это так то войдите в него</span>
                    </div>
                    <div class="info_box" v-if="page.inputData">
                        Ещё немного...
                        <span>Придумайте пароль для защиты вашего аккаунта</span>
                    </div>
                    <div class="info_box" v-if="page.confirmEmail">
                        Подтвердите вход
                        <span>Код подтверждения отправлен на почту il***4@gmail.com</span>
                    </div>
                </div>
                <div class="login__container__rigth__center_box">
                    <InputEmail v-if="page.inputEmail" @userExist="choseUser" />
                    <ChoseUser v-if="page.choseUser" />
                    <InputData v-if="page.inputData" />
                    <ConfirmEmail v-if="page.confirmEmail" />
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
            &__top_box {
                display: flex;
                justify-content: center;
                width: 100%;
                margin-bottom: 30px;
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
        }
    }
}
</style>