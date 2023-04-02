<template>
    <div class="home"></div>
</template>
<script setup>
import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requredAuth: true,
    name: ROUTES.HOME
})
</script>
<style lang="scss">
.home {
    
}
</style>