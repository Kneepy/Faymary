<script setup lang="ts">
/**
 * Для стилизации этого компонента нужно накинуть на компонент класс (или использовать класс icon)
 * И по классу можно изменять в css всё что нужно (по дефолту этот класс icon)
 *
 * В слоте нужно передавать строчку с названием иконки (close, settings и т.п)
 */
interface IconProps {
    fill?: boolean
    rounded?: boolean
    size?: number
    weight?: number
}
const props = withDefaults(defineProps<IconProps>(), {
    fill: false,
    rounded: true,
    size: null,
    weight: 400
})
const fill = computed(() => Number(props.fill))
const iconStyle = computed(() => ({
    fontSize:  props.size ? `${props.size}px` : ``,
    "font-variation-settings": `"FILL" ${fill.value}, "wght" ${props.weight}`
}))
</script>

<template>
    <span
        :class="[props.rounded ? `material-symbols-rounded` : `material-symbols-outline`, `icon`]"
        :style="iconStyle"
    >
        <slot />
    </span>
</template>