<template>
    <button class="contextmenu-item">
        <slot class="icon" name="icon" />
        <div class="text">
            <slot name="default" />
        </div>
    </button>
</template>

<style scoped lang="scss">
.contextmenu-item {
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    padding: 7px 25px 7px 10px;
    color: $white;
    font-weight: 600;
    font-size: 13px;
    &:hover {
        background-color: rgba(116, 116, 116, 0.2);
    }
    .text {
        color: $white;
        margin-left: 15px;
    }
}
</style>
<script setup lang="ts">
</script>