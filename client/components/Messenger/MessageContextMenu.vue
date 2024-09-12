<script setup lang="ts">
const props = defineProps<{
    x: number
    y: number
}>()

const emit = defineEmits<{
    (e: "onclose"): void

    // ответ на сообщение
    (e: "reply"): void

    // редактирование сообщения
    (e: "edit"): void

    // переслать сообщение
    (e: "forward"): void

    // копирование текста сообщения
    (e: "copy"): void

    // выделить сообщение
    (e: "select"): void

    // выбрали стикер для реакции
    (e: "reaction", emoji: string): void
}>()
const close = () => emit("onclose")
const emojis = ["🤡", "😈", "💩", "🔥", "🍻", "❤️", "👍", "👎", "💀"]
</script>

<template>
<ContextMenu :x :y @onclose="close" @click="close">
    <ContextPanel class="panel emojis">
        <HorizontalScroll>
            <Emoji
                v-for="emoji in emojis"
                :key="emoji"
                :emoji="emoji"
                @click.prevent="emit(`reaction`, emoji)"
                :size="35"
                class="emoji"
            />
            <template #next-btn>
                <button class="emoji-btn"><GIcon :size="17" :weight="600">chevron_right</GIcon></button>
            </template>
            <template #prev-btn>
                <button class="emoji-btn"><GIcon :size="17" :weight="600">chevron_left</GIcon></button>
            </template>
        </HorizontalScroll>
    </ContextPanel>
    <ContextPanel class="panel">
        <ContextItem @click="emit(`reply`), close()">
            <template #icon>
                <GIcon :size="22" fill>reply</GIcon>
            </template>
            Ответить
        </ContextItem>
        <ContextItem @click="emit(`edit`), close()">
            <template #icon>
                <GIcon :size="22" fill>edit</GIcon>
            </template>
            Редактировать
        </ContextItem>
        <ContextItem @click="emit(`forward`), close()">
            <template #icon>
                <GIcon :style="{transform: `scale(-1, 1)`}" :size="22" fill>reply</GIcon>
            </template>
            Переслать
        </ContextItem>
        <ContextItem @click="emit(`copy`), close()">
            <template #icon>
                <GIcon :size="22" fill>content_copy</GIcon>
            </template>
            Копировать текст
        </ContextItem>
        <ContextItem @click="emit(`select`), close()">
            <template #icon>
                <GIcon :size="22" fill>check_circle</GIcon>
            </template>
            Выделить
        </ContextItem>
    </ContextPanel>
</ContextMenu>
</template>

<style scoped lang="scss">
.panel {
    margin-bottom: 5px;
}
.emojis {
    display: flex;
    border-radius: 15px;
    max-width: 240px;
    overflow-x: hidden;
    .emoji {
        user-select: none;
        cursor: pointer;
        padding: 7px;
        background-color: transparent;
        border: none;
        font-size: 26px;
        &:first-child {
            margin-left: 10px;
        }
        &:last-child {
            margin-right: 10px;
        }
    }
    .emoji-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background-color: $contextmenu_button;
        width: fit-content;
        height: fit-content;
        margin: 0 7px;
        border: none;
        border-radius: 50%;
        .icon {
            color: $gray;
        }
    }
}
</style>