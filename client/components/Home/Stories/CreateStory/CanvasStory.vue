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
const saveCurrentCavnvasState = () => {
    canvasStates.value.push(ctx.value.getImageData(0, 0, canvasSize.value.width, canvasSize.value.height))
    draw.value = false
}
const rollBackCanvasState = (e: KeyboardEvent) => {
    if(e.key == "z" && e.ctrlKey) {
        ctx.value?.clearRect(0, 0, 100000, 100000);
        canvasStates.value.pop()

        if(canvasStates.value[canvasStates.value.length - 1]) ctx.value.putImageData(canvasStates.value[canvasStates.value.length - 1], 0, 0)
    }
}
const changeCanvas = (file: string) => {
    const img = new Image()
    img.src = file
    img.onload = () => ctx.value.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasSize.value.width, canvasSize.value.height)
}
onMounted(() => document.addEventListener("keydown", rollBackCanvasState))
onUnmounted(() => document.removeEventListener("keydown", rollBackCanvasState))
</script>
<template>
    <div @keyup="rollBackCanvasState" ref="canvasBox" class="canvas">
        <canvas 
            ref="canvas" 
            @mousemove="paint" 
            @mousedown="(e) => (draw = true, paint(e))" 
            @mouseup="saveCurrentCavnvasState" 
            @mouseout="draw = false" 
            :width="canvasSize.width" 
            :height="canvasSize.height"
        ></canvas>
        <StoryImages @changeCanvas="changeCanvas" />
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