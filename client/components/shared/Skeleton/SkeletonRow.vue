<script setup lang="ts">
interface Props {
    /**
     * flex direction
     */
    column?: boolean

    /**
     * Высота столбца
     */
    height?: number

    /**
     * Количество места занимаемого в flex сетке
     */
    flex?: number

    /**
     * Отступы у внутренних элементов. Всё указывается как у обычного padding
     */
    padding?: number[]
}
const props = defineProps<Props>()

const paddingStyle = computed(() => (props.padding ?? []).reduce((acc, val) => acc + ` ${val}px`, ""))
</script>

<template>
    <div
        class="row"
        :style="{
            flexDirection: props.column ? `column` : `row`,
            flex: `${props.flex}` ? props.flex : null,
            height: props.height ? `${props.height}px` : null,
            padding: !!paddingStyle ? paddingStyle : null
        }"
    >

        <slot />

    </div>
</template>

<style scoped lang="scss">
.row {
    display: flex;
    flex: 1;
}
</style>