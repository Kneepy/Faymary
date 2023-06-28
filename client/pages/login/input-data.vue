<script setup lang="ts">
import { ServerError, UserAPI } from '~/api';
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_INPUT_DATA,
    middleware: ["presence-email"]
})
const exists = useRoute().query.exists === "true" // т.к query это всегда строка

const userStore = useUserStore()
const appStateStore = useAppStateStore()
const isVisiblePass = ref(false)
const errors = ref<ServerError>()
const isValidData = computed(() => (userStore.tempUser.password?.length > 1) && !!userStore.tempUser.fullName?.length)
const clearErrorOnInputPass = () => errors.value = {} as ServerError
const loginUser = async () => {
    appStateStore.load = true
    try {
        const { user_id } = await (
            exists ? 
            UserAPI.loginUser({password: userStore.tempUser.password, email: userStore.tempUser.email}) : 
            UserAPI.createUser({password: userStore.tempUser.password, fullName: userStore.tempUser.fullName, email: userStore.tempUser.email})
        )
    
        if(user_id) {
            userStore.tempUser.id = user_id
            navigateTo({name: ROUTES.LOGIN_CONFIRM, query: {user_id}})
        }
    } catch (e: any) {
        errors.value = e
    }  
    appStateStore.load = false
}
</script>
<template>
    <div class="input__password">
        <div class="info_box">
            Ещё немного...
            <span>{{ exists ? `Введите пароль от вашего аккаунта` : `Придумайте пароль для защиты вашего аккаунта` }}</span>
        </div>
        <div class="input__password__center_box">
            <span class="hint" v-if="!exists" :style="{marginTop: `0px`}">Как вас будут назвать другие пользователи?</span>
            <input type="text" v-if="!exists" v-model="userStore.tempUser.fullName" placeholder="Как тебя зовут?"> 
            <span class="hint" :style="{marginTop: exists ? `0px` : ``}">Пароль должен содержать не менее 6 символов.</span>
            <div class="password_input">
                <input 
                    :class="errors?.message ? `input__error` : ``" 
                    :type="isVisiblePass ? `text` : `password`" 
                    v-model="userStore.tempUser.password" 
                    @input="clearErrorOnInputPass"
                    :placeholder="exists ? `Введите пароль` : `Придумайте пароль`"
                >
                <Button @click="() => isVisiblePass = !isVisiblePass">
                    <span class="material-symbols-rounded">
                        {{ isVisiblePass ? `visibility_off` : `visibility` }}
                    </span>
                </Button>
            </div>
            <span class="error" v-if="errors?.message">{{ errors?.message }}</span>
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
        flex-wrap: wrap;
        margin-bottom: 20px;
        .hint {
            font-size: 12px;
            color: $gray;
            margin-top: 10px;
            margin-bottom: 2px;
        }
        .error {
            font-size: 12px;
            color: $red;
            margin-bottom: 2px;
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
            &.input__error {
                border-color: $red;
                background-color: $error_red_background;
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