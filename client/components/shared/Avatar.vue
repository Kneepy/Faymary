<script setup lang="ts">
const props = defineProps<{
    size: number
    /**
     * Может быть как ссылкой так и id файла из files api
     */
    href?: string
    /**
    * Если значение не передано, то аватарка будет круглой
    * Если значение передано то она будет квадратной с закруглениями в ${ rounded } px
    */
    rounded?: number

    /**
    * Образ юзера необходимый если у него нет аватарки
    * Чтобы взять первую букву имени
    */
    userName: string
}>()

const config = useRuntimeConfig()
const img = computed(() => props.href ? (!!props.href?.split("http")[1] ? props.href : config.public.filesApiURL + props.href) : null)

const fontScale = computed(() => props.size / 2)
</script>

<template>
    <div
        v-if="!!img"
        class="avatar noselect"
        :style="{
            width: props.size + `px`,
            height: props.size + `px`,
            backgroundImage: `url(${img})`,
            borderRadius: !!props.rounded ? props.rounded + `px` : `50%`
        }"
    ></div>
    <div
        v-else
        class="avatar empty noselect"
        :style="{
            width: props.size + `px`,
            height: props.size + `px`,
            borderRadius: !!props.rounded ? props.rounded + `px` : `50%`,
            fontSize: fontScale + `px`
        }"
    >{{ props.userName[0] }}</div>
</template>

<style scoped lang="scss">
.avatar {
    width: 40px;
    height: 40px;
    background-position: center;
    background-size: cover;
    flex: none;

    &.empty {
        background-color: $white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $black;
        user-select: none;
        font-weight: 500;
    }
}
</style>