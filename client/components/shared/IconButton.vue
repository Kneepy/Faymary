<script setup lang="ts">
/*
* Для стилизации этого компонента нужно накинуть на компонент класс (или можно использовать button)
* И по классу можно изменять в css всё что нужно
*/
interface IconButtonProps {
    // размеры кнопки (т.к кнопка всегда круглая то задаётся одно значение)
    size?: number
    // задаёт закругления кнопки (border-radius)
    round?: number
}
const props = defineProps<IconButtonProps>()
</script>

<template>
    <button
        :style="{
            borderRadius: props.round &&`${props.round}px`,
            width: props.size && `${props.size}px`,
            height: props.size && `${props.size}px`
        }"
    >
        <slot />
    </button>
</template>

<style scoped lang="scss">
button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    height: fit-content;
    width: fit-content;
    padding: 8px;
    border-radius: 10px;
}
</style>