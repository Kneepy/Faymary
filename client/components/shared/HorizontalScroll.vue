<script lang="ts" setup>
const props = defineProps<{
    count: number
    shift?: number
}>()
const position = reactive({end: false, start: true})
const itemsBox = ref()
const visibleItemsBox = ref()
const shiftItems = ref(0)

const addShiftItems = (direction: number, skipPack: boolean = false) => { 
    if(itemsBox.value?.offsetWidth < visibleItemsBox.value?.offsetWidth) return

    const shift = (itemsBox.value?.offsetWidth / props.count) * Math.sign(direction)
    const countVisibleStories = Math.floor(visibleItemsBox.value.offsetWidth / Math.abs(shift))
    const widthVisibleStories = (props.count - countVisibleStories) * Math.abs(shift)
    const changeShiftValue = shiftItems.value - shift * (skipPack ? countVisibleStories : 1)

    if(changeShiftValue >= 0) {
        position.end = false
        position.start = true
        return shiftItems.value = 0
    }
    if(changeShiftValue <= -widthVisibleStories) {
        position.end = true
        position.start = false
        return shiftItems.value = -widthVisibleStories
    }
    else {
        position.end = false
        position.start = false
        return shiftItems.value = changeShiftValue
    }
}

const scrollItems = (e: WheelEvent) => addShiftItems(-e.deltaY, false)
const skipItems = (direction: number) => addShiftItems(direction, true)

const baseInterestShift = props.shift ?? 20;
/**
 * Эта функция смещает текущий скролл немного вперёд/назад взависимости от направления при наведении на кнопки следющей/предыдущей истории
 */
const interestButtonScale = (direction: number) => shiftItems.value += -Math.sign(direction) * baseInterestShift
/**
 * Эта функция возвращает текущий скролл назад при удалении курсора мыши с кнопок следющей/предыдущей истории
 */
const interestButtonUnscale = (direction: number) => shiftItems.value -= -Math.sign(direction) * baseInterestShift
const visibleButtons = computed(() => (itemsBox.value?.offsetWidth > visibleItemsBox.value?.offsetWidth))
</script>
<template>
    <div ref="visibleItemsBox" @wheel="scrollItems" class="horizontal-scroll">
        <slot 
            name="prev" 
            :prev="() => skipItems(-1)" 
            :shiftIncrease="() => interestButtonScale(-1)" 
            :shiftReduce="() => interestButtonUnscale(-1)"
            :visible="!position.start && visibleButtons"
        />
        <slot 
            name="next" 
            :next="() => skipItems(1)"
            :shiftIncrease="() => interestButtonScale(1)" 
            :shiftReduce="() => interestButtonUnscale(1)" 
            :visible="!position.end && visibleButtons"
        />
        <div ref="itemsBox" class="scroll-items"><slot :scrollPosition="position" :scroll="addShiftItems" :shift="shiftItems" /></div>
    </div>
</template>
<style lang="scss" scoped>
.scroll-items {
    width: fit-content;
}
</style>