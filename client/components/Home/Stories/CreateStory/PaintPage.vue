<script setup lang="ts">
const canvas = ref()
const ctx = computed(() => canvas.value?.getContext("2d"))
const colors = reactive(COLORS)
const storiesStore = useStoriesStore()
const canvasOptions = reactive(storiesStore.createOptions.draw)

const updateCanvas = () => {
    ctx.value.clearRect(0, 0, 100000, 100000);
    
    ctx.value.lineCap = "round";
    ctx.value.lineWidth = Number(canvasOptions.width) / 2.5
    ctx.value.strokeStyle = canvasOptions.color
    ctx.value.globalAlpha = Number(canvasOptions.opacity) / 100

    const initialCooridinates = {x: 90, y: 65}
    const lineWidth = 30;
    const lineHeight = 30;

    ctx.value.beginPath();
    ctx.value.moveTo(initialCooridinates.x, initialCooridinates.y);

    for(let i = 0; i < 5; i++) {
        ctx.value.lineTo(initialCooridinates.x + lineWidth*i, initialCooridinates.y + (i % 2 === 0 ? 0 : -lineHeight));
    }
    
    ctx.value.stroke();
}
onMounted(() => updateCanvas())
onUpdated(() => updateCanvas()),
watch(() => canvasOptions.color, () => updateCanvas())

const changeColor = (color: typeof COLORS[number]) => canvasOptions.color = color
const sliderProgress = reactive({progress: 0, offset: 0})
const isOverWidthSlider = ref(false)
const isOverOpacitySlider = ref(false)
const computedValueProgress = computed(() => sliderProgress.progress <= 100 && sliderProgress.progress >= 0)
const checkProgress = (e: any) => {
    sliderProgress.progress = Math.floor((e.offsetX / e.target.offsetWidth) * 100)
    sliderProgress.offset = e.offsetX
}
</script>
<template>
    <div class="paint-page">
        <canvas ref="canvas" height="100"></canvas>
        <div class="sliders">
            <div class="slider__box">
                <span>Толщина линии</span>
                <div v-if="isOverWidthSlider && computedValueProgress" class="slider__box__progress" :style="{left: `${sliderProgress.offset - 4}px`}">{{ sliderProgress.progress }}%<span></span></div>
                <input 
                    @mousemove="checkProgress" 
                    @mouseenter="isOverWidthSlider = true"
                    @mouseleave="isOverWidthSlider = false"
                    @input="updateCanvas" 
                    v-model="canvasOptions.width" 
                    max="100" type="range" class="slider"
                >
            </div>
            <div class="slider__box">
                <span>Непрозрачность</span>
                <div v-if="isOverOpacitySlider && computedValueProgress" class="slider__box__progress" :style="{left: `${sliderProgress.offset - 4}px`}">{{ sliderProgress.progress }}%<span></span></div>
                <input 
                    @mousemove="checkProgress"
                    @mouseenter="isOverOpacitySlider = true"
                    @mouseleave="isOverOpacitySlider = false"
                    @input="updateCanvas" 
                    v-model="canvasOptions.opacity" 
                    max="100" type="range" class="slider"
                >
            </div>
        </div>
        <div class="colors">
            <span class="placeholder">Цвет</span>
            <div class="colors__box">
                <div v-for="color in colors" @click="() => changeColor(color)" :style="{backgroundColor: color}" :key="color" class="color">
                    <span v-if="color === canvasOptions.color" class="material-symbols-rounded">done</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.paint-page {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    canvas {
        margin-top: 50px;
        width: 100%;
    }
    .sliders {
        display: flex;
        justify-content: space-around;
        margin-top: 50px;
        .slider__box {
            display: flex;
            flex-direction: column;
            position: relative;
            span {
                color: $gray;
                font-size: 12px;
                margin-left: 10px;
            }
            &__progress {
                position: absolute;
                background-color: $panel_background;
                width: 30px;
                height: 20px;
                color: $gray;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 3px;
                font-size: 12px;
                span {
                    display: inline-block;
                    border: 7px solid transparent;
                    border-top: 3px solid rgb(56, 56, 56);
                    position: absolute;
                    top: 20px;
                    right: 8px;
                }
            }
            .slider {
                flex: 1;
                margin: 10px;
                position: relative;
                display: flex;
                justify-content: space-between;
                cursor: pointer;
                -webkit-appearance: none;
                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    background-color: $white;
                    border-radius: 50%;
                    margin-top: -4px;
                    width: 10px;
                    height: 10px;
                }
                &::-webkit-slider-runnable-track {
                    -webkit-appearance: none;
                    background-color: $white;
                    height: 2px;
                    border-radius: 10px;
                }
            }
        }
    }
    .colors {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        .placeholder {
            color: $gray;
            font-size: 14px;
            margin-left: 10px;
        }
        &__box {
            display: flex;
            flex-wrap: wrap;
            padding: 7px;
            .color {
                width: 41px;
                height: 41px;
                border-radius: 50%;
                margin: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                span {
                    color: $gray;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>