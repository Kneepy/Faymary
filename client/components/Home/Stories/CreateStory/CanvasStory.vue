<script setup lang="ts">
const canvas = ref()
const canvasBox = ref<HTMLCanvasElement>()
const ctx = computed<CanvasRenderingContext2D>(() => canvas.value.getContext("2d"))
const storiesStore = useStoriesStore()
const draw = ref(false)
const canvasStates = ref([])
const canvasSize = computed(() => ({width: canvasBox.value?.offsetWidth, height: canvasBox.value?.offsetHeight}))
const paint = (e: any) => {
    if(draw.value) {
        ctx.value.beginPath()

        ctx.value.lineJoin = "round"
        ctx.value.fillStyle = storiesStore.createOptions.draw.color
        ctx.value.globalAlpha = Number(storiesStore.createOptions.draw.opacity) / 100

        ctx.value.arc(e.offsetX, e.offsetY, (Number(storiesStore.createOptions.draw.width) / 2.5 || 1), 0, Math.PI*2, true)
        ctx.value.fill()
    }
}
const saveCurrentCavnvas = () => {
    const currentCanvas = storiesStore.createOptions.canvases[storiesStore.createOptions.currentCanvas]
    currentCanvas.history.push(ctx.value.getImageData(0, 0, canvasSize.value.width, canvasSize.value.height))
    currentCanvas.current = canvas.value.toDataURL()
}
const rollBackCanvasState = (e: KeyboardEvent) => {
    if(e.key == "z" && e.ctrlKey) {
        ctx.value?.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);

        const currentCanvasHistory = storiesStore.createOptions.canvases[storiesStore.createOptions.currentCanvas].history
        currentCanvasHistory.pop()

        if(currentCanvasHistory.length > 0) {
            ctx.value.putImageData(storiesStore.createOptions.canvases[storiesStore.createOptions.currentCanvas].history[storiesStore.createOptions.canvases[storiesStore.createOptions.currentCanvas].history.length - 1], 0, 0)
        }
        storiesStore.createOptions.canvases[storiesStore.createOptions.currentCanvas].current = canvas.value.toDataURL()
    }
}
const changeCanvas = (canvasIndex: number) => {
    ctx.value.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    ctx.value.putImageData(storiesStore.createOptions.canvases[canvasIndex].history[storiesStore.createOptions.canvases[canvasIndex].history.length - 1], 0, 0)
}
const addFile = (file: string) => {
    const img = new Image()
    img.src = file

    img.onload = () => {
        const imgWidth = canvasSize.value.width
        const imgHeight = (imgWidth * img.height) / img.width  
        const offsetY = (canvasSize.value.height - imgHeight) / 2

        ctx.value.drawImage(img, 0, offsetY, imgWidth, imgHeight)

        saveCurrentCavnvas()
    }
}
onMounted(() => {
    document.addEventListener("keydown", rollBackCanvasState)
})
onUnmounted(() => document.removeEventListener("keydown", rollBackCanvasState))
</script>
<template>
    <div @keyup="rollBackCanvasState" ref="canvasBox" class="canvas">
        <canvas 
            ref="canvas" 
            @mousemove="paint" 
            @mousedown="(e) => (draw = true, paint(e))" 
            @mouseup="() => (draw = false, saveCurrentCavnvas())" 
            @mouseout="draw = false" 
            :width="canvasSize.width" 
            :height="canvasSize.height"
        ></canvas>
        <StoryImages @addFile="addFile" @changeCanvas="changeCanvas" />
    </div>
</template>
<style lang="scss" scoped>
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
        height: 240px;
        background: linear-gradient(0deg, $black 0%, transparent 100%);
        opacity: .9;
        transition: background-color 100ms ease-out;
        content: "";
    }
    canvas {
        position: absolute;
    }
}
</style>