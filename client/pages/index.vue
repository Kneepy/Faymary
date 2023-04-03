<template>
    <div class="home">
        {{ userStore.me }}
    </div>
</template>
<script setup lang="ts">
import { ROUTES } from "~/assets/constants/routes.constants";

const userStore = useUserStore()
definePageMeta({
    requredAuth: true,
    name: ROUTES.HOME
})
</script>
<style lang="scss">
.home {
    display: flex;
}
</style>