import Lottie, { type AnimationItem } from "lottie-web";

interface Options {
    autoplay?: boolean
    loop?: boolean
    speed?: number
}

/**
 * @param href ссылка или путь к json lottie анимации
 * @param options
 *
 * Возвращает ref() vue на образ анимации и элемент к которому должна быть привязана анимация
 */
export const useLottieAnimation = (href: string, options?: Options) => {
    const animationContainer = ref<HTMLElement>(null)
    const animationInstance = ref<AnimationItem>(null)

    onMounted(() => {
        animationInstance.value = Lottie.loadAnimation({
            container: animationContainer.value,
            path: href,
            renderer: "canvas",
            loop: options.loop ?? true,
            autoplay: options.autoplay ?? true
        })

        if (options.speed) animationInstance.value.setSpeed(options.speed)

    })

    return { animationInstance, animationContainer }
}