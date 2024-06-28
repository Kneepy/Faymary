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

const cropMessage = (msg: string, maxLength: number) => {
    if (msg.length < maxLength) return msg

    return msg.slice(0, maxLength)+ "..."
}
const testMsg = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consequatur eligendi, id nobis repellat rerum sint tempore vitae. Beatae blanditiis ipsum molestiae! Corporis dolorum eos eveniet nemo porro quasi, vel."
</script>

<template>
    <div class="messenger">
        <div class="left-bar">
            <div class="top-menu">
                <div class="options">
                    <button>
                        <span class="material-symbols-rounded">star</span>
                    </button>
                    <button>
                        <span class="material-symbols-rounded">settings</span>
                    </button>
                    <button>
                        <span class="material-symbols-rounded">block</span>
                    </button>
                </div>
                <div class="search">
                    <input type="text" placeholder="Найдите нужный вам диалог!">
                    <button class="search-btn">
                        <span class="material-symbols-rounded">hexagon</span>
                    </button>
                </div>
            </div>
            <div class="dialogs">
                <div class="dialog" v-for="i in Array(2)">
                    <Avatar :size=45 :user-name="`Ilya`" :href="`https://images.unsplash.com/photo-1719430074740-a5ee49a67d45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`" />
                    <div class="dialog__info">
                        <div class="name">Ilya Famin</div>
                        <div class="last-message overflow" :style="{}">{{ cropMessage(testMsg, 40) }}</div>
                        <div class="last-message-time">16:27</div>
                    </div>
                </div>
                <div class="dialog" v-for="i in Array(2)">
                    <Avatar :size=45 :user-name="`Ilya`" :href="`https://images.unsplash.com/photo-1719430074740-a5ee49a67d45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`" />
                    <div class="dialog__info">
                        <div class="name">Alex Korf</div>
                        <div class="last-message">Hello World</div>
                        <div class="last-message-time">16:24</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="messages"></div>
    </div>
</template>

<style scoped lang="scss">
.messenger {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    border: 1px solid $border_1;
    border-radius: 5px;
    padding: 5px 0;
    margin-top: 100px; // это нужно убрать после того как закончу разработку чата

    .left-bar {
        flex: 0.5;
        border-right: 1px solid $primary_border;
        padding: 10px;
        display: flex;
        flex-direction: column;

        .top-menu {
            .search {
                display: flex;
                position: relative;
                input {
                    margin-bottom: 10px;
                    border-radius: 10px;
                    outline: none;
                    flex: 1;
                    padding: 13px 20px 13px 46px;
                    background-color: $transparent_hover_background;
                    color: $white;
                    border: 1px solid $primary_border;
                    &::placeholder {
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        color: $gray_1;
                    }
                }
                &-btn {
                    position: absolute;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border: none;
                    outline: none;
                    top: 11px;
                    transition: 1.2s;
                    left: 13px;
                    &:hover {
                        transform: rotate(90deg);
                        transition: 1.2s;
                        span {
                            color: $gray;
                            transition: 200ms;
                        }
                    }
                    span {
                        color: $gray_1;
                        transition: 200ms;
                    }
                }
            }

            .options {
                display: flex;
                justify-content: end;
                margin-bottom: 10px;
                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    &:hover {
                        background-color: $transparent_button_hover_1;
                    }
                    span {
                        color: $gray_1;
                        font-size: 20px;
                        font-variation-settings:
                            'FILL' 1,
                            'wght' 400,
                            'GRAD' 0,
                            'opsz' 24
                        ;
                    }
                }
            }
        }
        .dialogs {
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
        }
    }
    .messages {
        flex: 1;
    }
}
</style>