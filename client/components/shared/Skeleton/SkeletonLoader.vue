<script setup lang="ts">
/**
 * Я думаю что этот компонент надо сильно дорабатывать
 * Типа добавить пропс elements = Array <{width, height, count, position}>
 * Но пока не вижу так много сценариев использования
 */
interface SkeletonLoaderProps {
    /**
     * Задаёт количество блоков skeleton
     */
    count?: number

    /**
     * Задаёт высоту блока skeleton
     */
    height?: number

    /**
     * Задаёт отступы для всего блока skeleton
     */
    padding?: number

    /**
     * Задаёт расстояние между элементами при count > 1
     */
    distance?: number
}

const props = defineProps<SkeletonLoaderProps>()
</script>

<template>
<div class="skeleton">
    <div
        class="skeleton-container"
        :style="{
            height: props.height ? `${props.height}px` : null,
            padding: props.padding ? `${props.padding}px` : null,
            marginBottom: props.distance ? `${props.distance}px` : null
        }"
        v-for="i in Array(props.count ?? 1)"
    >
        <slot />
    </div>
</div>
</template>

<style scoped lang="scss">
.skeleton-container {
    background-color: $transparent_panel_hover;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
}
</style>