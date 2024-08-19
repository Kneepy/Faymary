<template>
    <div class="contextmenu-panel">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.contextmenu-panel {
    background-color: $contextmenu_panel_background;
    backdrop-filter: blur(5px);
    transition: 0ms;
    box-shadow: 0 0 4px $black;
    z-index: 1000;
    border-radius: 8px;
    display: flex;
    width: fit-content;
    flex-direction: column;
    overflow: hidden;
}
</style>