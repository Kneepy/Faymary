<template>
    <div class="wef">
        <div class="wr" @click="f"></div>
        efwefef
    </div>
</template>
<script setup>
import {useUserStore} from "~/store/user"

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