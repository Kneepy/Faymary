<script setup lang="ts">

import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requiredAuth: false, // это только на время разработки, так должно быть true
    name: ROUTES.MESSENGER
})
useHead({
    title: "Сообщения"
})

</script>

<template>

</template>

<style scoped lang="scss">

</style>