<script setup lang="ts">

import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requiredAuth: true, // это только на время разработки, так должно быть true
    name: ROUTES.MESSENGER,
    layout: false // только на время разработки, но в обычное время default или просто удалить layout
})
useHead({
    title: "Сообщения"
})

</script>

<template>
</template>

<style scoped lang="scss">

</style>