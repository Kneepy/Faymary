<script setup lang="ts">
const emit = defineEmits(["onClose"])
const close = () => emit("onClose")

const pages = reactive({
    text: false, 
    paint: false,
    upload: true
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
const openUploadPage = () => {
    closePages()
    pages.upload = true
}



const currentImage = ref(0)
const files = ref([])
const countImages = computed(() => files.value?.length)
const flipImages = (e: WheelEvent) => {
    if(currentImage.value <= 0 && Math.sign(e.deltaY) > 0) return 
    if(currentImage.value >= countImages.value - 1 && Math.sign(e.deltaY) < 0) return
    currentImage.value -= Math.sign(e.deltaY)
}
const changeImage = (index: number) => currentImage.value = index

const formUpload = ref()
const clickFileInput = (e: any) => formUpload.value.click()
const previewFile = (e: any) => {
    const file = e.target?.files[0] ?? e.dataTransfer?.files[0]

    // я хз это должно быть временно - далее можно будет загружать видосы
    if(!file || file.type.split('/')[0] !== "image") return

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => {
        files.value.push(reader.result as string)
    }
    currentImage.value = files.value.length
}
</script>
<template>
    <ModalBox @onClose="close">
        <div class="create-story">
            <div class="canvas" :style="{backgroundImage: `url(${files[currentImage]})`}">
                <HorizontalScroll @wheel="flipImages" :count="countImages + 1" class="images">
                    <template #default="{ shift }">
                        <div class="images__box" :style="{transform: `translateX(${shift}px)`}">
                            <input ref="formUpload" @change="previewFile" type="file" accept="image/*" style="display:none">
                            <Button @click="clickFileInput" class="img add__img">
                                <span class="material-symbols-rounded">add</span>
                            </Button>
                            <div 
                                v-for="(image, i) in files" 
                                :key="i" class="img" 
                                :class="{active: (currentImage) === i}"
                                :style="{backgroundImage: `url(${image})`}"
                                @click="() => changeImage(i)"
                            ></div>
                        </div>
                    </template>
                </HorizontalScroll>
            </div>
            <div class="edit-panel">
                <div class="edit-panel__moves">
                    <Button 
                        class="edit_move" 
                        @click="openUploadPage" 
                        :class="{active: pages.upload}"
                    >
                        <span class="material-symbols-rounded">photo_library</span>
                    </Button>
                    <Button 
                        class="edit_move letters" 
                        @click="openTextPage" 
                        :class="{active: pages.text}"
                    >
                        <span class="material-symbols-rounded">match_case</span>
                    </Button>
                    <Button 
                        class="edit_move" 
                        @click="openPaintPage" 
                        :class="{active: pages.paint}"
                    >
                        <span class="material-symbols-rounded">palette</span>
                    </Button>
                </div>
                <div v-if="pages.upload" class="edit-panel__add edit-panel__img"></div>
                <div v-if="pages.text" class="edit-panel__add edit-panel__text"></div>
                <div v-if="pages.paint" class="edit-panel__add edit-panel__paint"></div>
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
        &::after {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 240px;
            background: linear-gradient(0deg, $black 0%, transparent 100%);
            opacity: .9;
            transition: background-color 100ms ease-out;
            content: "";
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
    }
}
</style>