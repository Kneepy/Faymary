<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_INPUT_DATA,
    middleware: ["presence-email"]
})
const { tempUser, ...userStore } = useUserStore()
const { exists } = useRoute().query
const isVisiblePass = ref(false)
const isValidData = computed(() => !!tempUser.password?.length && !!tempUser.fullName?.length)
const loginUser = async () => {
    const {user_id} = await userStore.createUser({password: tempUser.password, fullName: tempUser.fullName, email: tempUser.email})
}
</script>
<template>
    <div class="input__password">
        <div class="info_box">
            Ещё немного...
            <span>Придумайте пароль для защиты вашего аккаунта</span>
        </div>
        <div class="input__password__center_box">
            <input type="text" v-if="exists" v-model="tempUser.fullName" placeholder="Как тебя зовут?"> 
            <div class="password_input">
                <input :type="isVisiblePass ? `text` : `password`" v-model="tempUser.password" placeholder="Придумайте пароль">
                <Button @click="() => isVisiblePass = !isVisiblePass">
                    <span class="material-symbols-rounded">
                        {{ isVisiblePass ? `visibility_off` : `visibility` }}
                    </span>
                </Button>
            </div>
        </div>
        <div class="input__password__footer_box">
            <button :disabled="!isValidData" @click="loginUser">Продолжить</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input__password {
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
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            input {
                padding-right: 40px;
            }
            button {
                right: 10px;
                position: absolute;
                width: auto;
                background-color: transparent;
                display: flex;
                top: 8px;
                align-items: center;
                cursor: pointer;
                span {
                    color: $gray;
                    font-size: 22px;
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
</style>