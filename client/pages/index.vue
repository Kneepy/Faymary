<template>
    <div class="wef">
        <NuxtLink :to="{name: ROUTES.HOME}" class="wr">home</NuxtLink>
        <NuxtLink :to="{name: ROUTES.LOGIN}" class="wr">login</NuxtLink>
    </div>
</template>
<script setup>
import {useUserStore} from "~/store/user"
import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requredAuth: true,
    name: ROUTES.HOME
})

const store = useUserStore()

const f = () => {
    const {$socket} = useNuxtApp()

    store.setN(5)
    console.log(store.h)
}
</script>
<style lang="scss">
.wef{
    .wr {
        width: 400px;
        height: 10px;
        background-color: $black;
    }
}
</style>