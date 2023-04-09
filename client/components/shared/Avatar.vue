<script setup lang="ts">
const props = defineProps<{
    size: number,
    /**
     * Может быть как ссылкой так и id файла из api
     */
    href?: string
}>()
const config = useRuntimeConfig()

// тут должна быть замена на фотку отсутсвия аватарки но будет рандомная фотка с unsplash
const img = computed(() => props.href ? (!!props.href?.split("http")[1] ? props.href : config.public.imgesApiURL + props.href) : "https://images.unsplash.com/random")
</script>

<template>
    <div class="avatar" :style="{width: props.size + `px`, height: size + `px`, backgroundImage: `url(${img})`}"></div>
</template>

<style lang="scss">
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 15%;
    background-position: center;
    background-size: cover;
}
</style>