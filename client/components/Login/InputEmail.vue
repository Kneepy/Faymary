<script setup lang="ts">
const emit = defineEmits<{
    (e: "userExist", exist: boolean): void
}>()
const userData = reactive({
    email: ""
})
const userStore = useUserStore()
const isValidData = computed(() => !(!!userData.email.length))
const checkExistUser = async () => {
    userStore.tempUser = await userStore.getUserByEmail({email: userData.email})
    userStore.tempUser.email = userData.email

    emit("userExist", !!userStore.tempUser.id)
}
</script>
<template>
    <div class="input__email">
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
    }
}
</style>