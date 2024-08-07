<script setup lang="ts">
import type { Messenger } from "~/store/messenger";

const props = defineProps<{
    dialog: Messenger.Dialog
}>()
const userStore = useUserStore()

const cropMessage = (msg: string, maxLength: number) => {
    if (msg.length < maxLength) return msg

    return msg.slice(0, maxLength)+ "..."
}

const fullNameLastMessage = computed(() => {
    if (!props.dialog.lastMessage) return

    const lastMessageUser = props.dialog.lastMessage.user

    if (lastMessageUser.id === userStore.me.id) return "Вы"
    else return lastMessageUser.fullName
})
const participant = computed(() => props.dialog?.participants.length === 2 && props.dialog.participants.find(participant => participant.user.id !== userStore.me.id))
</script>

<template>
    <div class="dialog">
        <Avatar
            :size=45
            :user-name="participant ? participant.user.fullName : props.dialog.name"
            :href="participant ? participant.user.file_id : props.dialog.file_id" />
        <div class="dialog__info">
            <div class="name">{{ participant ? participant.user.fullName : props.dialog.name }}</div>
            <div class="last-message overflow">
                <span>{{ fullNameLastMessage }}</span>: {{ cropMessage(props.dialog?.lastMessage.msg ?? "Тут ещё нет сообщения", 40) }}
            </div>
            <div class="last-message-time">{{ props.dialog?.lastMessage.createdAt ?? "" }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    display: flex;
    align-items: center;
    background-color: $transparent_hover_background;
    padding: 15px;
    border-radius: 10px;
    cursor: pointer;
    transition: 200ms;
    margin-bottom: 8px;
    transform: scale(0.99);
    font-size: 18px;
    position: relative;
    &:hover {
        background-color: $transparent_button_hover_17;
        transition: 200ms;
        transform: scale(1);
    }
    &__info {
        margin-left: 20px;

        .name {
            color: $white;
            text-overflow: ellipsis;
            max-width: 260px;
            text-wrap: nowrap;
            overflow: hidden;
        }
        .last-message {
            color: $gray;
            text-overflow: ellipsis;
            max-width: 260px;
            text-wrap: nowrap;
            overflow: hidden;
            font-size: 16px;
            span {
                color: $gray_1;
            }
            &.overflow {
                overflow: initial;
                text-wrap: initial;
            }
        }
        .last-message-time {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 15px;
            color: $gray_1;
        }
    }
}
</style>