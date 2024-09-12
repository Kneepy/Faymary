<script setup lang="ts">
const UPDATE_POSITION_EVENT = "update:position"

const emit = defineEmits([UPDATE_POSITION_EVENT])
const sliderPosition = ref(0)
const changeWidthSliderPosition = (e: any) => {
    const shift = Math.sign(e.offsetX - sliderPosition.value)
    if(sliderPosition.value + shift <= 100 && sliderPosition.value + shift >= 0) {
        sliderPosition.value += shift
        emit(UPDATE_POSITION_EVENT, sliderPosition.value)
    }
}
</script>
<template>
    <div class="slider">
        <div class="line line__left" :style="{width: `${sliderPosition}%`}"></div>
        <div @drag="changeWidthSliderPosition" :style="{left: `${sliderPosition}%`}" class="point"></div>
        <div class="line line__right" :style="{width: `${100 - sliderPosition}%`}"></div>
    </div>
</template>
<style scoped lang="scss">
.slider {
    flex: 1;
    margin: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .point {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        top: -4px;
        background-color: #fff;
    }
    .line {
        height: 2px;
        border-radius: 10px;
        &__left {
            background-color: $white;
        }
        &__right {
            background-color: rgba($gray, .5);
        }
    }
}
</style>