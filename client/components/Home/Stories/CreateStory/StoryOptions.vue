<script setup lang="ts">
const emit = defineEmits(["changeCanvas", "addFile", "createCanvas", "fillCanvas"])
const storiesStore = useStoriesStore()

const countCanvases = computed(() => storiesStore.createOptions.canvases.length)
const formUpload = ref()

const flipCanvases = (e: WheelEvent) => {
    if(storiesStore.createOptions.currentCanvas <= 0 && Math.sign(e.deltaY) > 0) return 
    if(storiesStore.createOptions.currentCanvas >= countCanvases.value - 1 && Math.sign(e.deltaY) < 0) return
    storiesStore.createOptions.currentCanvas -= Math.sign(e.deltaY)
}
const changeCanvas = (index: number) => storiesStore.createOptions.currentCanvas = index

const clickFileInput = () => formUpload.value.click()
const previewFile = (e: any) => {
    const file = e.target?.files[0] ?? e.dataTransfer?.files[0]

    // я хз это должно быть временно - далее можно будет загружать видосы
    if(!file || file.type.split('/')[0] !== "image") return

    emit("addFile", URL.createObjectURL(e.target?.files[0]))
}
const createCanvas = () => emit("createCanvas")
</script>
<template>
    <div class="story-options">
        <Button @click="clickFileInput" class="add__img">
            <span class="material-symbols-outlined">photo_camera</span>
        </Button>
        <HorizontalScroll @wheel="flipCanvases" :count="countCanvases + 1" class="canvases">
            <template #default="{ shift }">
                <div class="canvases__box" :style="{transform: `translateX(${shift}px)`}">
                    <input ref="formUpload" @change="previewFile" type="file" accept="image/*" style="display:none">
                    <Button @click="createCanvas" class="canvas add__canvas">
                        <span class="material-symbols-rounded">add</span>
                    </Button>
                    <div 
                        v-for="(image, i) in storiesStore.createOptions.canvases" 
                        :key="i" class="canvas" 
                        :class="{active: storiesStore.createOptions.currentCanvas === i}"
                        :style="{backgroundImage: `url(${image.current})`}"
                        @click="() => changeCanvas(i)"
                    ></div>
                </div>
            </template>
        </HorizontalScroll>
        <div class="canvases-background">
            <div class="canvases-background__box"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.story-options {
    display: flex;
    align-items: center;
    justify-content: center;
    .add__img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        bottom: 100px;
        margin: 0 auto;
        z-index: 10;
        position: absolute;
        span {
            color: $white;
            font-size: 32px;
            font-weight: 300;
        }
    }
    .canvases {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 10;
        width: 100%;
        &__box {
            display: flex;
            width: fit-content;
            transition: 150ms;
            .add__canvas {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: $white;
                opacity: 1 !important;
                transform: scale(1) !important;
                span {
                    color: $black;
                    font-size: 27px;
                    font-weight: bold;
                }
            }
            .canvas {
                width: 50px;
                height: 50px;
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
</style>