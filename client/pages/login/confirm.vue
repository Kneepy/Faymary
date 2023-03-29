<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_CONFIRM,
})
const inputs = ref()
const countInputs = 6
const code: string[] = []
const countdownDuration = ref(299) // 5 минут
const countdown = computed(() => `${Math.floor(countdownDuration.value / 60)}:${countdownDuration.value % 60}`)

onMounted(() => {
    resetCountdown()
})

const resetCountdown = () => {
    if(countdownDuration.value <= 0) countdownDuration.value = 299

    const countdownInterval = setInterval(() => {
        if(countdownDuration.value <= 0) {
            clearInterval(countdownInterval)
            return
        }
        countdownDuration.value -= 1;
    }, 1000)
}
const sendCode = () => {
    console.log(code.join(""))
}
const resendCode = () => {
    resetCountdown()
}
const nextInput = (event: KeyboardEvent) => {
    const keyDeleteCode = "Backspace"
    if(!event.key.trim().length || (event.key.trim().length > 1 && event.key !== keyDeleteCode)) return

    const currentInput = inputs.value.findIndex((inp: any) => inp === event.target)

    if(event.key === keyDeleteCode) {
        if(currentInput === 0) return 

        delete code[currentInput]
        inputs.value[currentInput - 1].value = ""
        inputs.value[currentInput - 1].focus()
    } else {
        code[currentInput] = event.key
        inputs.value[currentInput].value = event.key

        if(currentInput === inputs.value.length - 1) {
            sendCode()
            return
        } 

        inputs.value[currentInput + 1].focus()
    }
}
</script> 
<template>
    <div class="confirm__email">
        <div class="info_box">
            Подтвердите вход
            <span>Код подтверждения отправлен на почту il***4@gmail.com</span>
        </div>
        <div class="confirm__email__inputs">
            <input v-for="i in countInputs" :key="i" type="text" ref="inputs" @keyup="nextInput" @input="(event: any) => event.target.value = event.target.value.trim()" :maxlength=1>
        </div>
        <div class="confirm__email__countdown">
            <span v-if="countdownDuration > 0">Сообщение придёт в течение {{ countdown }}</span>
            <Button @click="resendCode" :disabled="false" v-if="countdownDuration === 0" class="resend">Отправить ешё раз</Button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.confirm__email {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
    &__inputs {
        display: flex;
        justify-content: space-between;
        width: 100%;
        input {
            background: $primary_content_background;
            border: 2px solid $primary_border;
            color: $white;
            border-radius: 8px;
            font-size: 25px;
            text-align: center;
            margin: 4px 0px;
            transition: 100ms;
            width: 40px;
            height: 50px;
            &:hover, &:focus {
                border-color: $border_1;
                transition: 100ms;
            }
        }
    }
    &__countdown {
        color: $gray;
        margin-top: 40px;
        font-size: 14px;
        width: 100%;
        display: flex;
        justify-content: center;
        .resend {
            width: 100%;
            background-color: transparent;
            color: $white;
            &:hover {
                background-color: $transperent_hover_background;
            }
        }
    }
}
</style>