<script setup>
import { ROUTES } from '~/assets/constants/routes.constants';

definePageMeta({
    name: ROUTES.SUPPORT,
    requiredAuth: true,
})
useHead({
    title: "Поддержка",
})
</script>
<template>
    <div>
        support
    </div>
</template>
