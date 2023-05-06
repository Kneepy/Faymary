<script setup>
import { ROUTES } from '~~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.SETTINGS,
    requredAuth: true
})
useHead({
    title: "Настройки",
})
</script>
<template>
    <div>
        settings
    </div>
</template>