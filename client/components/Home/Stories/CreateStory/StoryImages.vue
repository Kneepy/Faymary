<script setup lang="ts">
const emit = defineEmits(["changeCanvas"])
const currentImage = ref(null)
const files = ref<string[]>([])
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

    files.value.push(URL.createObjectURL(e.target?.files[0]))
    currentImage.value = files.value.length - 1
}

watch(() => currentImage.value, index => emit("changeCanvas", files.value[index]))
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
                    v-for="(image, i) in files" 
                    :key="i" class="img" 
                    :class="{active: (currentImage) === i}"
                    :style="{backgroundImage: `url(${image})`}"
                    @click="() => changeImage(i)"
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
</style>