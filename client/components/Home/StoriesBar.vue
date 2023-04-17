<script lang="ts" setup>
const storiesBox = ref(); // Блок со всеми историями
const visibleStoriesBox = ref() // Блок в котором находятся истории
const stories = ref([]) // массив ссылок на блоки историй, его нужно заменить на данные из storiesStore
const shiftStories = ref(0) // текущий сдвиг в скроле историй (значение всегда меньше 0)
const shiftPosition = reactive({end: false, start: true}) // нужно для динамического указания позиции (только начало или конец)

/**
 * Так, ну грубо говоря при direction 1 истории едут вперёд, а при direction -1 истории двужутся назад
 */
const addShiftStories = (direction: number, skipPack: boolean) => {
    const shift = (storiesBox.value?.offsetWidth / stories.value.length) * Math.sign(direction)
    const countVisibleStories = Math.floor(visibleStoriesBox.value.offsetWidth / Math.abs(shift))
    const widthVisibleStories = (stories.value.length - countVisibleStories) * Math.abs(shift)
    const changeShiftValue = shiftStories.value - shift * (skipPack ? countVisibleStories : 1)

    if(changeShiftValue >= 0) {
        shiftPosition.end = false
        shiftPosition.start = true
        return shiftStories.value = 0
    }
    if(changeShiftValue <= -widthVisibleStories) {
        shiftPosition.end = true
        shiftPosition.start = false
        return shiftStories.value = -widthVisibleStories
    }
    else {
        shiftPosition.end = false
        shiftPosition.start = false
        return shiftStories.value = changeShiftValue
    }
}
const scrollStories = (e) => addShiftStories(-e.deltaY, false)
const skipStories = (direction: number) => addShiftStories(direction, true)


const baseInterestShift = 20;
/**
 * Точно так же -1 назад 1 вперёд
 */
const interestButtonScale = (direction: number) => shiftStories.value += -Math.sign(direction) * baseInterestShift
const interestButtonUnscale = (direction: number) => shiftStories.value -= -Math.sign(direction) * baseInterestShift
</script>
<template>
    <div class="stories" ref="visibleStoriesBox" @wheel="scrollStories">
        <div 
            @mouseenter="() => interestButtonScale(-1)" 
            @mouseleave="() => interestButtonUnscale(-1)"
            @click="() => skipStories(-1)" v-if="!shiftPosition.start && shiftStories < 0"
            class="scroll scroll-left"
        >
            <span class="material-symbols-rounded">navigate_next</span>
        </div>
        <div 
            @mouseenter="() => interestButtonScale(1)" 
            @mouseleave="() => interestButtonUnscale(1)" 
            @click="() => skipStories(1)" 
            v-if="!shiftPosition.end && shiftStories <= 0"
            class="scroll scroll-right"
        >
            <span class="material-symbols-rounded">navigate_next</span>
        </div>
        <div class="stories__box" ref="storiesBox">
            <Button v-for="s in 15" class="story" ref="stories" :key="s" :style="{transform: `translateX(${shiftStories}px)`, backgroundImage: `url(https://source.unsplash.com/random?landscapes)`}">
                <div class="author">
                    <div class="border">
                        <Avatar class="user-avatar" :size=35 href="https://source.unsplash.com/random?peoples" />  
                    </div>
                    <span>{{ s }}Faymary</span>
                </div>
            </Button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.stories {
    width: 100%;
    margin: 0 auto;
    border: 1px solid $border_1;
    border-radius: 20px;
    background-color: $primary_content_background;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 20px;
    position: relative;
    &::-webkit-scrollbar {
        display: none;
    }

    &__box {
        display: flex;
        .story {
            min-width: 100px;
            width: 150px;
            height: 145px;
            margin-right: 5px;
            border-radius: 10px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: relative;
            padding: 0px;
            padding-bottom: 10px;
            overflow: hidden;
            &::before {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: $transperent_hover_content_background;
                content: "";
            }
            &::after {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 110px;
                background: linear-gradient(0deg, $black 0%, transparent 100%);
                opacity: .9;
                content: "";
            }
            .author {
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                .border {
                    padding: 2px;
                    border: 2px solid $primary_blue;
                    border-radius: 50%;
                    width: fit-content;
                    .user-avatar {
                        border-radius: 50%;
                    }
                }
                span {
                    color: $white;
                    font-size: 13px;
                    overflow: hidden;
                    font-weight: 500;
                    max-width: 60px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .scroll {
        position: absolute;
        top: 0;
        height: 100%;
        width: 40px;
        background-color: transparent;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.scroll-left {
            left: 0;
            span {
                transform: rotate(180deg);
            }
        }
        &.scroll-right {
            right: 0;
        }
        span {
            color: $white;
            font-size: 65px;
            font-weight: 300;
        }
    }
}
</style>