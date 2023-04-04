<script setup lang="ts">
const { size, href } = defineProps<{
    size: number,
    /**
     * Может быть как ссылкой так и id файла из api
     */
    href?: string
}>()
const config = useRuntimeConfig()
const img = (!!href?.split("http")[1] ? href : config.public.imgesApiURL + (href ?? ""))
</script>

<template>
    <div class="avatar" :style="{width: size + `px`, height: size + `px`, backgroundImage: `url(${img})`}"></div>
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