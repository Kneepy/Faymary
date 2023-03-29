<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_INPUT_EMAIL
})
const userData = reactive({
    email: ""
})
const userStore = useUserStore()
const isValidData = computed(() => !(!!userData.email.length))
const checkExistUser = async () => {
    userStore.tempUser = await userStore.getUserBy({email: userData.email})
   
    if(!userStore.tempUser.id) {
        userStore.tempUser.email = userData.email
        navigateTo({name: ROUTES.LOGIN_INPUT_DATA, query: {exists: false as any}})
    }
    else {
        navigateTo({name: ROUTES.LOGIN_CHOSE_USER, query: {exists: true as any}})
    }
}
</script>
<template>
    <div class="input__email">
        <div class="info_box">
            Введи свою почту
            <span>Ваша почта будет использоватся для входа в аккаунт</span>
        </div>
        <div class="input__email__center_box">
            <input type="text" v-model="userData.email" placeholder="Введите email"> 
        </div>
        <div class="input__email__footer_box">
            <Button :disabled="isValidData" @click="checkExistUser">Продолжить</Button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input__email {
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
    }
}
</style>