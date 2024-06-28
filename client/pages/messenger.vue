<script setup lang="ts">

import { ROUTES } from "~/assets/constants/routes.constants";

definePageMeta({
    requiredAuth: false, // это только на время разработки, так должно быть true
    name: ROUTES.MESSENGER,
    layout: false // только на время разработки, но в обычное время default или просто удалить layout
})
useHead({
    title: "Сообщения"
})

</script>

<template>
    <div class="messenger">
        <div class="dialogs">

        </div>
        <div class="messages"></div>
    </div>
</template>

<style scoped lang="scss">
.messenger {
    width: 900px;
    margin: 0 auto;
    display: flex;
    height: 100px;
    border: 1px solid $border_1;
    border-radius: 5px;
    padding: 5px 0;
    .dialogs {
        flex: 0.5;
        border-right: 1px solid $primary_border;
    }
    .messages {
        flex: 1;
    }
}
</style>