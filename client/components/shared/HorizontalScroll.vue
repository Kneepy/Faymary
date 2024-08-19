<script setup lang="ts">
// наружний блок который видит пользователь
const clientScrollBox = ref<HTMLElement>(null)

// все элементы
const itemsScrollBox = ref<HTMLElement>(null)

// текущий сдвиг скрола
const currentShift = ref(0)
// место где находится текущий скрол в конце или начле или середине (когда оба false)
const position = reactive({ end: false, start: true })

// добавляет сдвиг к скролу
const addShift = (shift: number) => {
    const visibleWidth = clientScrollBox.value.clientWidth
    const realWidth = itemsScrollBox.value.clientWidth
    const maxShift = realWidth - visibleWidth
    const newCurrentShift = currentShift.value + shift

    if (newCurrentShift >= maxShift) {
        currentShift.value = maxShift
        position.start = false
        position.end = true
        return
    }
    if (newCurrentShift <= 0) {
        currentShift.value = 0
        position.start = true
        position.end = false
        return
    }
    else {
        position.start = false
        position.end = false
        currentShift.value = newCurrentShift
    }
}

// реализация скрола через сдвиги
const scroll = (e: WheelEvent) => addShift([0, -0].includes(e.deltaY) ? e.deltaX : e.deltaY)

// реализация эффекта при наведении на кнопки прокручивания
const hoverScrollEffect = (direction: -1 | 1) => {
    const visibleWidth = clientScrollBox.value.clientWidth
    const currentPosition = {...position}
    addShift((visibleWidth / 25) * direction)

    if (currentPosition.start === true) position.start = true
    if (currentPosition.end === true) position.end = true
}

// пролистывание элементов при нажатии на кнопки
const scrollItems = (direction: -1 | 1) => {
    if (itemsScrollBox.value?.clientWidth < clientScrollBox.value.clientWidth) return
    addShift(clientScrollBox.value.clientWidth * direction)
}

</script>

<template>
<div
    @wheel.prevent="scroll"
    :ref="el => clientScrollBox = <HTMLElement> el"
    class="horizontal-scroll"
>
    <div
        :ref="el => itemsScrollBox = <HTMLElement> el"
        :style="{
            transform: `translateX(${-currentShift}px)`,
        }"
        class="scroll-items"
    >
        <slot />
    </div>
    <div
        v-if="!position.start"
        @mouseenter="() => hoverScrollEffect(-1)"
        @mouseleave="() => hoverScrollEffect(1)"
        @click="scrollItems(-1)"
        class="prev-btn"
    >
        <slot name="prev-btn" />
    </div>
    <div
        v-if="!position.end"
        @mouseenter="() => hoverScrollEffect(1)"
        @mouseleave="() => hoverScrollEffect(-1)"
        @click="scrollItems(1)"
        class="next-btn"
    >
        <slot name="next-btn" />
    </div>
</div>
</template>

<style scoped lang="scss">
.horizontal-scroll {
    max-width: 100%;
    overflow: hidden;
    position: relative;
    .scroll-items {
        display: flex;
        width: fit-content;
    }
    .prev-btn, .next-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
    .prev-btn {
        left: 0;
    }
    .next-btn {
        right: 0;
    }
}
</style>