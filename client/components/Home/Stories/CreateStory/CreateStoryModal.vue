<script setup lang="ts">
const emit = defineEmits(["onClose"])
const close = () => emit("onClose")

const pages = reactive({
    text: false, 
    paint: true,
})
const closePages = () => Object.keys(pages).forEach(key => pages[key] = false)
const openTextPage = () => {
    closePages()
    pages.text = true
}
const openPaintPage = () => {
    closePages()
    pages.paint = true
}

const storiesStore = useStoriesStore()
const publishStories = () => storiesStore.publishedStories()
</script>
<template>
    <ModalBox @onClose="close">
        <div class="create-story">
            <CanvasStory />
            <div class="edit-panel">
                <div class="edit-panel__moves">
                    <Button 
                        class="edit_move" 
                        @click="openPaintPage" 
                        :class="{active: pages.paint}"
                    >
                        <span class="material-symbols-rounded">palette</span>
                    </Button>
                    <Button 
                        class="edit_move letters" 
                        @click="openTextPage" 
                        :class="{active: pages.text}"
                    >
                        <span class="material-symbols-rounded">match_case</span>
                    </Button>
                </div>
                <PaintPage v-if="pages.paint" />
                <TextPage v-if="pages.text" class="edit-panel__add edit-panel__text"></TextPage>
                <Button @click="publishStories" class="publish-story">Опубликовать</Button>
            </div>
        </div>
    </ModalBox>
</template>
<style scoped lang="scss">
.create-story {
    width: 780px;
    height: 900px;
    background-color: $primary_content_background;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    .canvas {
        width: 480px;
        height: 100%;
        background-position: center;
        background-size: cover;
        position: relative;
        overflow: hidden;
        border-right: 1px solid $border_1;
        &::after {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 130px;
            background: linear-gradient(0deg, $black 0%, transparent 100%);
            opacity: .9;
            transition: background-color 100ms ease-out;
            content: "";
        }
        canvas {
            position: absolute;
        }
        .images {
            position: absolute;
            bottom: 30px;
            left: 30px;
            z-index: 10;
            width: 100%;
            .images__box {
                display: flex;
                width: fit-content;
                transition: 150ms;
                .add__img {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: $white;
                    opacity: 1 !important;
                    transform: scale(1) !important;
                    span {
                        color: $black;
                        font-size: 35px;
                        font-weight: bold;
                    }
                }
                .img {
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    background-position: center;
                    background-size: cover;
                    margin-right: 12px;
                    transition: 150ms;
                    cursor: pointer;
                    opacity: .7;
                    transform: scale(.98);
                    transition: 100ms;
                    &:hover {
                        opacity: 1;
                        transform: 100ms;
                        transform: scale(1) translateY(-5px);
                    }
                    &.active {
                        opacity: 1;
                        transform: 100ms;
                        transform: scale(1) translateY(-5px);
                    }
                }
            }
        }
    }
    .edit-panel {
        flex: 1;
        position: relative;
        &__moves {
            background-color: $panel_background;
            display: flex;
            padding: 0 20px;
            border-bottom: 1px solid $border_1;
            .edit_move {
                background-color: transparent;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0;
                &:hover {
                    box-shadow: inset 0px -2px 0px $border_1;
                }
                
                &.letters {
                    span {
                        font-weight: 700;
                    } 
                }
                &.active {
                    box-shadow: inset 0px -2px 0px $white;
                    span {
                        color: $white;
                    }
                }
                span {
                    color: $gray;
                    font-weight: 400;
                    font-size: 26px;
                }
            }
        }
        .publish-story {
            position: absolute;
            bottom: 15px;
            width: 130px;
            font-size: 14px;
            right: 15px;
        }
    }
}
</style>