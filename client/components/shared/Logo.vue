<script setup lang="ts">
import logo from "~/public/logo.jpg"
const { size } = defineProps<{
    size: number
}>()
</script>
<template>
    <div class="logo" :style="{width: size + `px`, height: size + `px`, backgroundImage: `url(${logo})`}"></div>
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