<script setup lang="ts">
const emit = defineEmits<{
    (e: "change", value: string | null): void
}>()
const props = defineProps<{
    placeholder?: string
    rows?: number
    maxHeight?: number
}>()

const resize = (e: Event) => {
    // создаём событие в которое отправляем значение поля
    emit(`change`, (e.target as HTMLInputElement).value)

    e.target.style.height = `auto`

    const { scrollHeight } = e.target
    const paddingTop = getComputedStyle(<Element>e.target).paddingTop.split("px")[0]
    const paddingBottom = getComputedStyle(<Element>e.target).paddingBottom.split("px")[0]
    const padding = Number(paddingTop) + Number(paddingBottom)
    const maxHeight = Number(getComputedStyle(<Element>e.target).maxHeight?.split("px")[0])

    if ((scrollHeight - padding) > maxHeight) {
        e.target.style.height = `${maxHeight}px`
        e.target.style.overflowY = "scroll"
        return
    }

    e.target.style.height = `${scrollHeight - padding}px`
}
</script>

<template>
<textarea @input="resize" :rows="props.rows ?? 1" :placeholder="props.placeholder" :style="{maxHeight: props.maxHeight}"></textarea>
</template>