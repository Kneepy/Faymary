<script setup lang="ts">
const { size, href } = defineProps<{
    size: number,
    href: string
}>()
</script>

<template>
    <div class="logo" :style="{width: size + `px`, height: size + `px`, backgroundImage: `url(${href})`}"></div>
</template>

<style lang="scss">
.logo {
    width: 40px;
    height: 40px;
    border-radius: 15%;
    background-position: center;
    background-size: cover;
}
</style>