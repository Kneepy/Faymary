<script setup lang="ts">
import type { File, User } from "~/api";

const emit = defineEmits<{
    (e: "close"): void
}>()
const props = defineProps<{
    /**
     * файл из StoreAPI
     */
    images: File[]

    /**
     * Если нужно то можно установить то какой файл будет открыт по умолчанию
     */
    current?: File

    /**
     * Если нужно то можно указать пользователя которого нужно отобразить при показе изображений
     * (тот пользователь который выложил эти фото)
     */
    owner?: User
}>()

const close = () => emit("close")

const fileStyle = reactive({ width: "auto", height: "auto" })
const currentFile = ref<File>(null)
const isShowFilesPanel = ref<boolean>(true)
let showFilesPanelTimeout = null

onMounted(() => {
    currentFile.value = props.current ? props.current : props.images[0]


    document.addEventListener("mousemove", showFilesPanel)
    document.addEventListener("wheel", wheelSlideFiles, {
        passive: true,
        capture: true
    })
})
onUnmounted(() => {
    document.removeEventListener("mousemove", showFilesPanel)
    document.removeEventListener("wheel", wheelSlideFiles, false)
})
watch(() => currentFile.value, (new_image) => {
    const img = new Image()
    img.src = useFile(new_image.id)
    img.onload = () => {
        if (img.width > img.height) {
            fileStyle.width = "70vw"
        } else {
            fileStyle.height = "100vh"
        }
    }
})
const isCurrent = (file: File) => file === currentFile.value
const changeCurrent = (file: File) => currentFile.value = file
/**
 * Скрытие панельки с выбором фалов через 5 секунд
 */
const showFilesPanel = () => {
    isShowFilesPanel.value = true
    clearTimeout(showFilesPanelTimeout)
    showFilesPanelTimeout = setTimeout(() => {
        isShowFilesPanel.value = false
    }, 5000000000000000000000)
}
let lastWheelEvent = 0
const wheelSlideFiles = (e: WheelEvent) => {
    const directionX = e.deltaX === 0 ? 0 : (e.deltaX > 0 ? 1 : -1)
    const directionY = e.deltaY === 0 ? 0 : (e.deltaY > 0 ? 1 : -1)
    const direction = directionX !== 0 ? directionX : directionY

    slideFiles(direction)
}
const slideFiles = (direction: number) => {
    const now = Date.now()

    if (now - lastWheelEvent > 100) {
        const currentFileIndex = props.images.indexOf(currentFile.value)

        if (currentFileIndex + direction < 0) {
            currentFile.value = props.images[props.images.length - 1]
        }
        else if (currentFileIndex + direction > props.images.length - 1) {
            currentFile.value = props.images[0]
        }
        else {
            currentFile.value = props.images[currentFileIndex + direction]
        }
        lastWheelEvent = now
    }
}
const getImgURL = (file: File) => useFile(file?.id)
const howLongAgo = (unix: string | number) => useTime(unix, { exactTime: true })
</script>

<template>
<ModalBox @on-close="close">
    <IconButton @click="() => slideFiles(-1)" class="next_button prev">
        <GIcon :size=40 :weight="400">chevron_left</GIcon>
    </IconButton>
    <IconButton @click="() => slideFiles(1)" class="next_button next">
        <GIcon :size=40 :weight="400">chevron_right</GIcon>
    </IconButton>
    <img class="preview" :src="getImgURL(currentFile)" :style="fileStyle" alt="IMG"/>
    <TransitionGroup name="files_panel">
        <template v-if="isShowFilesPanel">
            <div class="files">
                <div
                    v-for="img in props.images"
                    :style="{ backgroundImage: `url('${ getImgURL(img) }')` }"
                    :class="[`file`, isCurrent(img) ? `active` : ``]"
                    @click="() => changeCurrent(img)"
                ></div>
            </div>
            <div class="metadata">
                <div class="owner">
                    {{ props.owner?.fullName }}
                </div>
                <div class="created-at">
                    {{ howLongAgo(currentFile?.createdAt) }}
                </div>
            </div>
        </template>
    </TransitionGroup>
</ModalBox>
</template>

<style scoped lang="scss">
.preview {
    aspect-ratio: auto;
}
.next_button {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    background-color: transparent;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
        background-color: $transparent_button_hover_17;
        .icon {
            color: $gray;
        }
    }
    &.next {
        right: 20px;
    }
    &.prev {
        left: 20px;
    }
    .icon {
        color: $gray_1;
    }
}
.files {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);
    display: flex;
    z-index: 10;
    padding: 10px;
    .file {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        background-position: center;
        background-size: cover;
        opacity: .6;
        cursor: pointer;
        margin-left: 10px;
        &:first-child {
            margin-left: 0;
        }
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
        width: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: -1;
        filter: blur(30px);
    }
}
.files_panel-enter-active, .files_panel-leave-active {
    transition: opacity .5s;
}
.files_panel-enter, .files_panel-leave-to {
    opacity: 0;
}
.metadata {
    position: absolute;
    left: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    .owner {
        color: $gray;
        font-size: 16px;
        font-weight: 600;
    }
    .created-at {
        color: $gray_1;
        font-weight: 500;
        font-size: 14px;
    }
}
</style>