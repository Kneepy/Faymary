<template>
    <div class="home">
        <StoriesBar />
    </div>
</template>
<script setup lang="ts">
import { StoriesAPI } from "~/api/stories";
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
    width: 900px;
    margin: 0 auto;
    margin-top: 15px;
}
</style>
