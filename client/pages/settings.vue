<script setup lang="ts">
import { ROUTES } from '~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.SETTINGS,
    requiredAuth: true
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