<script setup lang="ts">
import { type Message, type File } from "~/api";

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
const emit = defineEmits<{
    (e: "like", emoji: string): void
}>()

const images = computed(() => props.message?.attachments?.files ?? [])
const likes = computed(() => props.message?.attachments?.likes?.filter(like => Number(like.number_likes) > 0) ?? [])
const replyMessage = computed(() => props.message.attachments.messages?.length ? props.message.attachments.messages[0] : null)
const defaultFileModal = ref<File>(null)
const isOpenFilesModal = ref<boolean>(false)
const closeFilesModal = () => isOpenFilesModal.value = false
const openFilesModal = (file: File) => {
    defaultFileModal.value = file
    isOpenFilesModal.value = true
}
const time = computed(() => useTime(props.message?.createdAt))
</script>

<template>
    <div
        :class="{ active: false, interlocutor: !props.own }"
        class="message_wrapper"
    >
        <Avatar v-if="!own" :size=35 :user-name="props.message.user.fullName" :href="props.message.user.file_id" class="avatar" />
        <div
            class="message"
            :style="{
                width: images.length ? `100%` : null
            }"
        >
            <div class="container">
                <span v-if="!own" class="user-name">{{ props.message.user.fullName }}</span>
                <div v-if="replyMessage" class="answer-message">
                    <div class="user">{{ replyMessage.user.fullName }}</div>
                    <div class="text">
                        {{ replyMessage.msg }}
                    </div>
                </div>
                <div v-if="images.length" class="images">
                    <div
                        v-for="img in images"
                        :style="{ backgroundImage: `url(${useFile(img.id)})` }"
                        :class="{
                            last: images.indexOf(img) === images.length - 1 && images.length % 2 !== 0
                        }"
                        @click="() => openFilesModal(img)"
                        class="image"
                    >
                    </div>
                </div>
                <span>{{ props.message.msg }}</span>
                <div class="addition">
                    <div v-if="likes.length" class="reactions">
                        <div
                            v-for="like in likes"
                            :key="like.id"
                            @click="() => emit(`like`, like.unity)"
                            class="reaction noselect"
                            :class="{ active: like.has_liked }"
                        >
                            <Emoji :emoji="like.unity" :size="25" /> <span>{{ like.number_likes }}</span>
                        </div>
                    </div>
                    <div class="date">{{ time }}</div>
                </div>
            </div>
            <ImagesModal v-if="isOpenFilesModal" @close="closeFilesModal" :images="images" :current="defaultFileModal" :owner="props.message.user" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.message_wrapper {
    width: 100%;
    display: flex;
    padding: 10px 0;
    justify-content: end;
    &:first-child {
        padding: 10px 0;
    }
    &.active {
        background-color: $transparent_button_hover_1;
    }
    &.interlocutor {
        justify-content: start;
        .container {
            border-radius: 10px 10px 10px 0;
        }
    }
    .avatar {
        align-self: end;
        margin-right: 10px;
    }
    .message {
        align-self: end;
        max-width: 80%;
        display: flex;
        .container {
            color: $white;
            background-color: $message_background;
            display: flex;
            flex-direction: column;
            border-radius: 10px 10px 0 10px;
            padding: 10px 15px 8px;
            width: 100%;
            .user-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
                color: $white; // этот цвет должен выбираться в настройках мессенджера
            }
            .answer-message {
                margin-bottom: 10px;
                padding: 5px 20px 5px 15px;
                background-color: rgba(223, 223, 223, .05); // и этот тоже
                border-radius: 5px;
                cursor: pointer;
                border-left: 5px solid rgba(223, 223, 223, 1); // этот цвет должен выбираться в настройках мессенджера
                .user {
                    color: rgba(223, 223, 223, 1); // этот цвет должен выбираться в настройках мессенджера
                    font-weight: 700;
                    font-size: 14px;
                }
                .text {
                    color: $gray;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 15px;
                    white-space: nowrap;
                }
            }
            .images {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 10px;
                width: 100%;
                .image {
                    background-size: cover;
                    background-position: center;
                    border-radius: 10px;
                    margin: 3px;
                    height: 250px;
                    cursor: pointer;
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
                        padding: 5px 10px;
                        background-color: $transparent_button_hover_17;
                        border-radius: 100px;
                        margin-top: 5px;
                        margin-left: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        box-sizing: border-box;
                        &:first-child {
                            margin-left: 0;
                        }
                        &.active {
                            background-color: $gray_1;
                            color: $white;
                        }
                        span {
                            font-size: 15px;
                            font-weight: bold;
                            margin-right: 5px;
                            margin-left: 10px;
                        }
                    }
                }
                .date {
                    color: $gray;
                    font-size: 12px;
                    align-self: end;
                    margin-left: 35px;
                    flex: 1;
                    text-align: right;
                }
            }
        }
    }
}
</style>