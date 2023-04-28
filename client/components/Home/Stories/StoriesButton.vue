<script setup lang="ts">
const props = defineProps<{
    fileId: string
}>()
const storyFile = useFile(props.fileId)
</script>
<template>
    <Button class="user-stories" :style="{backgroundImage: `url(${storyFile})`}">
        <slot />
    </Button>
</template>
<style scoped lang="scss">
.user-stories {
    width: 169px; // 140px; 212px
    height: 145px;
    margin-right: 5px;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    position: relative;
    padding: 0px;
    overflow: hidden;
    &::before {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: $transperent_hover_content_background;
        transition: background-color 100ms ease-out;
        content: "";
    }
    &::after {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 110px;
        background: linear-gradient(0deg, $black 0%, transparent 100%);
        opacity: .9;
        transition: background-color 100ms ease-out;
        content: "";
    }
    &:hover {
        &::before {
            background-color: $transperent_hover_content_background_2;
            transition: background-color 100ms ease-out;
        }
        &::after {
            background: linear-gradient(0deg, $black 10%, transparent 100%);
            transition: background-color 100ms ease-out;
        }
    }
    .author {
        z-index: 10;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        margin-left: 15px;
        margin-bottom: 10px;
        .border {
            padding: 3px;
            border: 2.5px solid $primary_blue;
            border-radius: 50%;
            width: fit-content;
            .user-avatar {
                border-radius: 50%;
                margin-top: -1px;
            }
        }
        span {
            color: $white;
            font-size: 13px;
            overflow: hidden;
            font-weight: 500;
            max-width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>