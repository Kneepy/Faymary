<script lang="ts" setup>
const { disabled } = defineProps<{
    disabled?: boolean,
}>()
</script>

<template>
    <button :disabled="disabled">
        <slot />
    </button>
</template>

<style lang="scss">
button {
    background-color: $white;
    width: 100%;
    border-radius: 8px;
    padding: 7px 0;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: 100ms;
    &:disabled {
        transition: 200ms;
        color: $black;
        cursor: default;
        opacity: .6;
    }
}
</style>