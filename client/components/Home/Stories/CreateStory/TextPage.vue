<script setup lang="ts">

</script>
<template>
    <div class="text-page">
        <Button  class="add-text-btn">
            <p>Добавить надпись</p>
            <span class="material-symbols-rounded">add</span>
        </Button>
    </div>
</template>
<style lang="scss" scoped>
.text-page {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    .add-text-btn {
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        width: 200px;
        padding: 5px 14px;
        font-weight: 500;
        span {
            font-size: 26px;
            font-weight: 500;
        }
    }
}
</style>