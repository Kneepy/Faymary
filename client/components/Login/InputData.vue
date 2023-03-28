<script setup lang="ts">
const { userName } = defineProps<{
    userName?: string
}>()
const userData = reactive({
    userName: "",
    password: ""
})
const ui = reactive({
    isVisiblePass: false
})
const isValidData = computed(() => !(!!userData.password.length) && (userName ? true : !(!!userData.userName.length) ))
const checkExistUser = () => {

}
</script>
<template>
    <div class="input__password">
        <div class="input__password__center_box">
            <input type="text" v-if="userName" v-model="userData.userName" placeholder="Как тебя зовут?"> 
            <div class="password_input">
                <input :type="ui.isVisiblePass ? `text` : `password`" v-model="userData.password" placeholder="Придумайте пароль">
                <button @click="() => ui.isVisiblePass = !ui.isVisiblePass">
                    <span class="material-symbols-rounded">
                        {{ ui.isVisiblePass ? `visibility_off` : `visibility` }}
                    </span>
                </button>
            </div>
        </div>
        <div class="input__password__footer_box">
            <button :disabled="isValidData" @click="checkExistUser">Продолжить</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input__password {
    &__top_box {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
        flex-wrap: wrap;
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