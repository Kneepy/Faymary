<script setup lang="ts">
const emit = defineEmits<{
    (e: "close"): void
}>()
const props = defineProps<{
    /**
     * Ссылка на файл из StoreAPI
     */
    images: string[]

    /**
     * Если нужно то можно установить то какой файл будет открыт по умолчанию
     */
    current?: string
}>()

const close = () => emit("close")

const fileRefs = props.images.map(image => useFile(image))
const fileStyle = reactive({ width: "auto", height: "auto" })
const currentFile = ref<string>("")
const isShowFilesPanel = ref<boolean>(true)
let showFilesPanelTimeout = null

onMounted(() => {
    currentFile.value = props.current ? useFile(props.current) : fileRefs[0]

    document.addEventListener("mousemove", showFilesPanel)
})
onUnmounted(() => {
    document.removeEventListener("mousemove", showFilesPanel)
})
watch(() => currentFile.value, (new_image) => {
    const img = new Image()
    img.src = new_image
    img.onload = () => {
        if (img.width > img.height) {
            fileStyle.width = "70vw"
        } else {
            fileStyle.height = "100vh"
        }
    }
})
const isCurrent = (file) => file === currentFile.value
const changeCurrent = (file) => currentFile.value = file
const showFilesPanel = () => {
    isShowFilesPanel.value = true
    clearTimeout(showFilesPanelTimeout)
    showFilesPanelTimeout = setTimeout(() => {
        isShowFilesPanel.value = false
    }, 50000000000000000)
}
</script>

<template>
<ModalBox @on-close="close">
    <img class="preview" :src="currentFile" :style="fileStyle" alt="IMG"/>
    <TransitionGroup name="fade">
        <div class="files" v-if="isShowFilesPanel">
            <div
                v-for="fileRef in fileRefs"
                :style="{ backgroundImage: `url('${ fileRef }')` }"
                :class="[`file`, isCurrent(fileRef) ? `active` : ``]"
                @click="() => changeCurrent(fileRef)"
            ></div>
        </div>
    </TransitionGroup>
</ModalBox>
</template>

<style scoped lang="scss">
.preview {
    aspect-ratio: auto;
}
.files {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);
    display: flex;
    z-index: 10;
    .file {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        background-position: center;
        background-size: cover;
        opacity: .6;
        cursor: pointer;
        margin-left: 10px;
        &.active {
            opacity: 1;
            transform: translate(0, -10px);
        }
    }
    &::after {
        content: "";
        height: 100%;
        left: 0;
        bottom: 0;
        width: 120%;
        position: absolute;
        background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
        z-index: -1;
        filter: blur(10px);
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>