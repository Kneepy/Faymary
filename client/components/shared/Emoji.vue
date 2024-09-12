<script setup lang="ts">
import { useLottieAnimation } from "~/composables/useLottieAnimation";

interface Props {
    emoji: string
    size?: number
}
const props = withDefaults(defineProps<Props>(), {
    size: 40
})

const playAnimation = ref(false)
const emojiUnicode = computed(() => props.emoji.codePointAt(0).toString(16))
const animationHref = computed(() => `https://fonts.gstatic.com/s/e/notoemoji/latest/${emojiUnicode.value}/lottie.json`)
const style = reactive({
    width: `${props.size}px`,
    height: `${props.size}px`,
})

const { animationContainer, animationInstance } = useLottieAnimation(animationHref.value, { autoplay: false, speed: 1.4, loop: false })
const play = () => animationInstance.value.play()
const stop = () => animationInstance.value.stop()
watch(() => playAnimation.value, (v) => {
    if (v) {
        animationInstance.value.setLoop(true)
        play()
    } else {
        animationInstance.value.setLoop(false)
        animationInstance.value.addEventListener("complete", stop)
        animationInstance.value.removeEventListener("complete", stop)
    }
})
</script>

<template>
    <div
        @mouseenter="playAnimation = true"
        @mouseleave="playAnimation = false"
        ref="animationContainer"
        :style="style"
        class="emoji"
    ></div>
</template>