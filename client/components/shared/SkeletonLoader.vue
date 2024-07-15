<script setup lang="ts">

</script>

<template>
<div class="skeleton-loader"></div>
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
</style>