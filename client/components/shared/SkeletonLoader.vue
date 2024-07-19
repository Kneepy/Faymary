<script setup lang="ts">
/**
 * Я думаю что этот компонент надо сильно дорабатывать
 * Типа добавить пропс elements = Array <{width, height, count, position}>
 * Но пока не вижу так много сценариев использования
 */
const props = defineProps<{
    /**
     * Задаёт количество блоков skeleton
     */
    count?: number
}>()
</script>

<template>
<div class="skeleton">
    <div class="skeleton-container" v-for="i in Array(props.count ?? 1)">
        <div class="left">
            <div class="skeleton box"></div>
        </div>
        <div class="right">
            <div class="skeleton elongated"></div>
            <div class="skeleton elongated"></div>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.skeleton-loader {
    background-size: 600px;
    background-image: linear-gradient(90deg, rgb(219 219 219) 0px, rgb(237 237 237) 75px, rgb(219 219 219) 150px);
    background-position: 0;
    animation: shimmer 2s infinite linear;
    height: 100px;
    width: 100%;
}
@keyframes shimmer {
    0% {
        background-position: 0;
    }
    100% {
        background-position: 600px;
    }
}

.skeleton-container {
    background-color: $transparent_panel_hover;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    .right {
        flex: 1;
        flex-direction: column;
    }
    .left, .right {
        display: flex;
        .skeleton {
            &.elongated {
                height: 10px;
                border-radius: 5px;
                margin-left: 10px;
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            &.box {
                width: 40px;
                height: 40px;
            }
            background-color: $transparent_panel_hover_8;
            border-radius: 10px;
            background-size: 600px;
            background-image: linear-gradient(130deg, $transparent_panel_hover_8 0px, $shimmer_effect_gray 75px, $transparent_panel_hover_8 150px);
            background-position: 0;
            animation: shimmer 1.5s infinite linear;
        }
    }
}
</style>