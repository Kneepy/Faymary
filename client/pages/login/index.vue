<template>
    <div>
        <NuxtLink :to="{name: ROUTES.LOGIN_CONFIRM}">confirm</NuxtLink>
    </div>
</template>

<script setup>
import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requredAuth: false,
    name: ROUTES.LOGIN
})
</script>