<template>
    <div class="logo" :style="{width: size + `px`, height: size + `px`}"></div>
</template>
<script setup lang="ts">
const { size } = defineProps<{
    size: number
}>()
</script>
<style lang="scss">
.logo {
    width: 40px;
    height: 40px;
    border-radius: 15%;
    background-image: url("~/logo.jpg");
    background-position: center;
    background-size: cover;
}
</style>