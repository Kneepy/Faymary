<script setup lang="ts">
import { type Message } from "~/api";

interface Props {
    message: Message

    /**
     * Флаг который указывает что это сообщение отправлена с аккаунта текущего пользователя
     * (это его сообщение)
     */
    own?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    own: false
})
const images = computed(() => props.message?.attachments?.files)
</script>

<template>
    <div :class="[`message`, !props.own ? `interlocutor` : ``]">
        <Avatar v-if="!own" :size=18 :user-name="props.message.user.fullName" :href="props.message.user.file_id" class="avatar" />
        <div class="container">
            <span v-if="!own" class="user-name">{{ props.message.user.fullName }}</span>
            <div class="answer-message">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at est ac tellus congue commodo...
            </div>
            <template v-if="images">
                <div class="images">
                    <div
                        v-for="img in images"
                        :style="{ backgroundImage: `url(${useFile(img.id)})` }"
                        :class="{
                            last: images.indexOf(img) === images.length - 1 && images.length % 2 !== 0
                        }"
                        class="image"
                    ></div>
                </div>
            </template>
            <span>{{ props.message.msg }}</span>
            <div class="addition">
                <div class="reactions">
                    <div class="reaction noselect active">
                        ✌️ <span>200</span>
                    </div>
                    <div class="reaction noselect">
                        🍻 <span>652</span>
                    </div>
                </div>
                <div class="date">{{ props.message.createdAt }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.message {
    align-self: end;
    max-width: 80%;
    display: flex;
    margin-bottom: 20px;
    &:first-child {
        margin-top: 20px;
    }
    &.interlocutor {
        align-self: auto;
        .container {
            border-radius: 10px 10px 10px 0;
        }
    }
    .avatar {
        align-self: end;
        margin-right: 10px;
    }
    .container {
        color: $white;
        background-color: $message_background;
        width: fit-content;
        display: flex;
        flex-direction: column;
        border-radius: 10px 10px 0 10px;
        padding: 10px 15px 8px;
        .user-name {
            font-size: 16px;
            font-weight: bold;
            color: $white; // этот цвет должен выбираться в настройках мессенджера
        }
        .answer-message {
            margin: 10px;
            padding: 5px 20px;
            background-color: rgba(90, 90, 90, 0.2); // и этот тоже
            border-radius: 5px;
            cursor: pointer;
            border-left: 6px solid $white; // этот цвет должен выбираться в настройках мессенджера
        }
        .images {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
            .image {
                background-size: cover;
                background-position: center;
                border-radius: 10px;
                margin: 3px;
                height: 250px;
                width: calc(50% - 6px);
                &.last {
                    width: 100%;
                }
            }
        }
        .addition {
            display: flex;
            justify-content: space-between;
            .reactions {
                display: flex;
                .reaction {
                    color: $gray;
                    cursor: pointer;
                    padding: 2px 5px;
                    background-color: $transparent_button_hover_17;
                    border-radius: 15px;
                    font-size: 16px;
                    margin-right: 5px;
                    margin-top: 5px;
                    &.active {
                        background-color: $gray_1;
                        color: $white;
                    }
                    span {
                        font-size: 13px;
                        font-weight: bold;
                        margin-right: 4px;
                    }
                }
            }
            .date {
                color: $gray;
                font-size: 12px;
                align-self: end;
                margin-left: 35px;
            }
        }
    }
}
</style>