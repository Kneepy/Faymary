<script setup lang="ts">
const props = defineProps<{
    /**
     * Координаты клика
     * Не нужно их менять или ещё что-то просто в том виде в котором есть
     * Компонент сам определит где выхвать меню
     */
    x: number
    y: number
}>()
const emit = defineEmits<{
    (e: "onclose"): void
}>()

const contextmenu = ref<HTMLElement>(null)
const checkClickOutside = (e: Event) => !(e.target === contextmenu.value || contextmenu.value.contains(<HTMLElement>e.target)) && emit("onclose")


onMounted(() => {
    document.addEventListener("click", checkClickOutside)

    // чтобы меню скрывалось при любом чихе
    document.addEventListener("wheel", () => emit("onclose"))
    document.addEventListener("keydown", () => emit("onclose"))
    document.addEventListener("resize", () => emit("onclose"))
})
onUnmounted(() => {
    document.removeEventListener("click", checkClickOutside)
    document.removeEventListener("wheel", () => emit("onclose"))
    document.removeEventListener("keydown", () => emit("onclose"))
    document.removeEventListener("resize", () => emit("onclose"))
})

// определяем место где должно находится меню
const position = computed(() => {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const menuWidth = contextmenu.value?.clientWidth
    const menuHeight = contextmenu.value?.clientHeight
    const resultPosition = { x: null, y: null }

    if (props.x + menuWidth < windowWidth) {
        resultPosition.x = props.x
    } else {
        resultPosition.x = props.x - menuWidth
    }
    if (props.y + menuHeight < windowHeight) {
        resultPosition.y = props.y - menuHeight / 2
    } else {
        resultPosition.y = windowHeight - menuHeight
    }

    return resultPosition
})
</script>

<template>
    <Teleport to="body">
        <div
            @wheel.stop
            @scroll.stop
            @keydown.stop
            @resize.stop
            @click.stop
            @contextmenu.prevent.stop
            :ref="el => contextmenu = <HTMLElement> el"
            :style="{ top: `${position.y}px`, left: `${position.x}px` }"
            class="contextmenu"
        >
            <slot />
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
.contextmenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: 0ms;
}
</style>