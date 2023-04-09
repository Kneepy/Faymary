<script setup>
const emit = defineEmits(["onClose"])
const sideBox = ref()
const checkOutsideClick = (e) => e.target === sideBox.value && emit("onClose")
</script>
<template>
    <Teleport to="body">
        <div @click="checkOutsideClick" :ref="(el) => sideBox = el" class="modal_background">
            <div class="modal_content">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss">
.modal_background {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: $transperent_hover_content_background;
    display: flex;
    align-items: center;
    justify-content: center;
    .modal_content {
        width: min-content;
        height: min-content;
    }
}
</style>