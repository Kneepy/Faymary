<script setup lang="ts">
const inputs = ref()

onMounted(() => {
})
</script> 
<template>
    <div class="confirm__email">
        <input v-for="i in 6" :key="i" type="text" ref="inputs" v-model="inputs[i].value.v">
        {{ inputs[0]?.value?.v }}
    </div>
</template>
<style scoped lang="scss">
.confirm__email {
    display: flex;
    input {
        background: $primary_content_background;
        border: 1px solid $primary_border;
        color: $white;
        border-radius: 8px;
        font-size: 25px;
        text-align: center;
        margin: 4px 0px;
        transition: 100ms;
        width: 40px;
        height: 50px;
        &:hover, &:focus {
            border-color: $border_1;
            transition: 100ms;
        }
    }
}
</style>