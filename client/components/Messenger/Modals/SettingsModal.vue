<script setup lang="ts">
const emit = defineEmits(["onClose"])
const close = () => emit("onClose")
</script>

<template>
    <ModalBox @on-close="close">

    </ModalBox>
</template>

<style scoped lang="scss">

</style>