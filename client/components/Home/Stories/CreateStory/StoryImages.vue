<script setup lang="ts">
const emit = defineEmits(["changeCanvas", "addFile"])
const storiesStore = useStoriesStore()
const files = ref<string[]>([])
const countImages = computed(() => files.value?.length)

const flipImages = (e: WheelEvent) => {
    if(storiesStore.createOptions.currentCanvas <= 0 && Math.sign(e.deltaY) > 0) return 
    if(storiesStore.createOptions.currentCanvas >= countImages.value - 1 && Math.sign(e.deltaY) < 0) return
    storiesStore.createOptions.currentCanvas -= Math.sign(e.deltaY)
}
const changeCanvas = (index: number) => storiesStore.createOptions.currentCanvas = index

const formUpload = ref()

const clickFileInput = (e: any) => formUpload.value.click()
const previewFile = (e: any) => {
    const file = e.target?.files[0] ?? e.dataTransfer?.files[0]

    // я хз это должно быть временно - далее можно будет загружать видосы
    if(!file || file.type.split('/')[0] !== "image") return

    storiesStore.createOptions.canvases.push({
        history: [] as any
    })
    // файл не рисуется на панели холстов при этой штуке
    storiesStore.createOptions.currentCanvas = storiesStore.createOptions.canvases.length - 1
    emit("addFile", URL.createObjectURL(e.target?.files[0]))
}

watch(() => storiesStore.createOptions.currentCanvas, index => emit("changeCanvas", index))
</script>
<template>
    <HorizontalScroll @wheel="flipImages" :count="countImages + 1" class="images">
        <template #default="{ shift }">
            <div class="images__box" :style="{transform: `translateX(${shift}px)`}">
                <input ref="formUpload" @change="previewFile" type="file" accept="image/*" style="display:none">
                <Button @click="clickFileInput" class="img add__img">
                    <span class="material-symbols-rounded">add</span>
                </Button>
                <div 
                    v-for="(image, i) in storiesStore.createOptions.canvases" 
                    :key="i" class="img" 
                    :class="{active: storiesStore.createOptions.currentCanvas === i}"
                    :style="{backgroundImage: `url(${image.current})`}"
                    @click="() => changeCanvas(i)"
                ></div>
            </div>
        </template>
    </HorizontalScroll>
</template>
<style lang="scss" scoped>
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
                font-size: 27px;
                font-weight: bold;
            }
        }
        .img {
            width: 60px;
            height: 60px;
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
</style>