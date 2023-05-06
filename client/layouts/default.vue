<script setup>
// сделать loading page
const appStateStore = useAppStateStore()
</script>
<template>
    <div class="default" v-if="!!appStateStore.authorization">
        <Header />
        <slot />
    </div>
</template>
<style lang="scss" scoped>
.default {
    padding-top: 70px;
}
</style>