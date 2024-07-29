<script setup lang="ts">
import type { Messenger } from "~/store/messenger";

const props = defineProps<{
    dialog: Messenger.CustomDialog
}>()

const cropMessage = (msg: string, maxLength: number) => {
    if (msg.length < maxLength) return msg

    return msg.slice(0, maxLength)+ "..."
}
const lastMessage = computed(() => props.dialog.messages[props.dialog.messages.length - 1])
</script>

<template>
    <div class="dialog">
        <Avatar :size=45 :user-name="props.dialog.name" :href="props.dialog.file_id" />
        <div class="dialog__info">
            <div class="name">{{ props.dialog.name }}</div>
            <div class="last-message overflow" :style="{}">{{ cropMessage(lastMessage.msg, 40) }}</div>
            <div class="last-message-time">{{ lastMessage.createdAt }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>