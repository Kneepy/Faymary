<script setup lang="ts">
const props = defineProps<{
    height?: number
    width?: number

    /**
     * в массиве можно всё указывть также как у margin из css
     */
    margin?: number[]

    /**
     * Если несколько блков повторяются то можно указать count и их будет сколько надо
     */
    count?: number

    /**
     * Степень закругления граней у блоков skeleton
     */
    radius?: number
}>()

const marginStyle = computed(() => (props.margin ?? []).reduce((acc, val) => acc + ` ${val}px`, ""))

</script>

<template>
    <div
        class="skeleton"
        v-for="i in Array(props.count ?? 1)"
        :style="{
            width: props.width ? `${props.width}px` : null,
            height: props.height ? `${props.height}px` : null,
            borderRadius: props.radius ? `${props.radius}px` : null,
            margin: !!marginStyle ? marginStyle : null,
        }"
    ></div>
</template>

<style scoped lang="scss">
.skeleton {
    background-color: $transparent_panel_hover_8;
    border-radius: 10px;
    background-size: 600px;
    background-image: linear-gradient(130deg, $transparent_panel_hover_8 0px, $shimmer_effect_gray 75px, $transparent_panel_hover_8 150px);
    background-position: 0;
    height: 10px;
    animation: shimmer 1.5s infinite linear;
    @keyframes shimmer {
        0% {
            background-position: 0;
        }
        100% {
            background-position: 600px;
        }
    }
}
</style>