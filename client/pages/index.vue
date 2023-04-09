<template>
    <div class="home">
    </div>
</template>
<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requredAuth: true,
    name: ROUTES.HOME,
})
useHead({
    title: "Новости",
})
</script>
<style lang="scss">
.home {
    display: flex;
}
</style>
