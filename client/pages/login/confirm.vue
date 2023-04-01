<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.LOGIN_CONFIRM,
    middleware: ["presence-email"]
})
const userStore = useUserStore()
const appState = useAppStateStore()
const { user_id } = useRoute().query
const inputs = ref()
const ui = reactive({ incorrectCode: false, confirmedCode: false })
const countInputs = 6
const code: string[] = []
const countdownDuration = ref(299) // 5 минут
const countdown = computed(() => `${Math.floor(countdownDuration.value / 60)}:${countdownDuration.value % 60}`)
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
const sendCode = async () => {
    appState.load = true
    try {
        await userStore.confirmUser({user_id: user_id?.toString() as string, code: code.join("")})
        appState.load = false
        ui.confirmedCode = true
    } catch (e) {
        ui.incorrectCode = true
    }
    appState.load = false
}
const resendCode = () => userStore.sendConfirmCode({email: userStore.tempUser.email, user_id: userStore.tempUser.id})
const nextInput = (event: KeyboardEvent) => {
    const keyDeleteCode = "Backspace"
    if(!event.key.trim().length || (event.key.trim().length > 1 && event.key !== keyDeleteCode)) return

    const currentInput = inputs.value.findIndex((inp: any) => inp === event.target)

    if(event.key === keyDeleteCode) {
        if(currentInput === 0) return 
        delete code[currentInput]
        inputs.value[currentInput].value = ""
        
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
const inputCode = (event: any) => {
    event.target.value = event.target.value.trim()
    if(ui.incorrectCode) ui.incorrectCode = false
    if(ui.confirmedCode) ui.confirmedCode = false
}

onMounted(() => {
    resetCountdown()
})
</script> 
<template>
    <div class="confirm__email">
        <div class="info_box">
            Подтвердите вход
            <span>Код подтверждения отправлен на почту {{ userStore.tempUser.email }}</span>
        </div>
        <div class="confirm__email__inputs">
            <input 
                v-for="i in countInputs" :key="i" type="text" ref="inputs" 
                @keyup="nextInput" @input="inputCode" 
                :maxlength=1
                :class="[ui.incorrectCode ? `incorrect` : ``, ui.confirmedCode ? `confirmed` : ``]"
            >
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
            &.incorrect {
                border-color: $red;
                background-color: $error_red_background;
            }
            &.confirmed {
                border-color: $green;
                background-color: $confirm_green_background;
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