<script setup lang="ts">
import { useInfiniteScroll } from "~/composables/useInfiniteScroll";
import { type Messenger, useUserStore } from "~/store";

const emit = defineEmits<{
    (e: "loadMore", count: number): void
}>()
const props = defineProps<{
    dialog: Messenger.Dialog
}>()

const userStore = useUserStore()
const messagesBoxRef = ref<HTMLBaseElement>(null)
const infiniteScroll = ref(null)

onMounted(() => {
    infiniteScroll.value = useInfiniteScroll(messagesBoxRef.value, (count) => emit("loadMore", count));
})
onUnmounted(() => !!infiniteScroll.value && infiniteScroll.value())
</script>

<template>
    <div class="dialog">
        <div :style="{backgroundImage: `url('')`, filter: `blur(3px)` }" class="background"></div>
        <div class="messages scroll" ref="messagesBoxRef">
            <Message v-for="message in props.dialog.messages" :message="message" :own="message.user.id === userStore.me.id" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    padding-right: 5px;
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
    }
    .messages {
        display: flex;
        flex-direction: column-reverse;
        padding: 0 5px;
        overflow-y: auto;
        max-height: 523px;
        min-height: 100px;
        flex: 1;
        position: absolute;
        top: 0;
        left: 5px;
        right: 5px;
    }
}
</style>