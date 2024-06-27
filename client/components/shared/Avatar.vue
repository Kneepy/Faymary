<script setup lang="ts">
const props = defineProps<{
    size: number,
    /**
     * Может быть как ссылкой так и id файла из files api
     */
    href?: string
    /*
    * Если значение не передано, то аватарка будет круглой
    * Если значение передано то она будет квадратной с закруглениями в ${ rounded } px
    */
    rounded?: number
}>()

const userStore = useUserStore()
const config = useRuntimeConfig()
const img = computed(() => props.href ? (!!props.href?.split("http")[1] ? props.href : config.public.filesApiURL + props.href) : null)
const fullName = computed(() => userStore.me.fullName ?? "")
</script>

<template>
    <div
        v-if="!!img"
        class="avatar"
        :style="{width: props.size + `px`, height: size + `px`, backgroundImage: `url(${img})`}"
    ></div>
    <div
        v-else
        class="avatar empty"
        :style="{ borderRadius: props.rounded ? props.rounded + `px` : `50%` }"
    >{{ fullName[0] }}</div>
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
        font-size: 20px;
    }
}
</style>