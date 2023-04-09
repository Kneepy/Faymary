<script setup>
const emit = defineEmits(["onClose"])
const close = () => emit("onClose")
</script>
<template>
    <ModalBox @onClose="close">
        <div class="change_account">
            efwf
        </div>
    </ModalBox>
</template>
<style lang="scss">
.change_account {
    background-color: #fff;
    width: 100px;
    height: 100px;
}
</style>