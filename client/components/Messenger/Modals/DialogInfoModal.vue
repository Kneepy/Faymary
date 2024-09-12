<script setup lang="ts">
const emit = defineEmits(["onClose"])
const close = () => emit("onClose")
</script>

<template>
    <ModalBox @on-close="close">
        <div class="dialog-info">
            <div class="header">
                <div class="title">Информация о пользователе</div>
                <IconButton @click="close">
                    <GIcon>close</GIcon>
                </IconButton>
            </div>
            <div class="info">
                <div class="user">
                    <Avatar :size=65 :user-name="`Alex Korf`" :href="`https://images.unsplash.com/photo-1719430074740-a5ee49a67d45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`" />
                    <div class="user__info">
                        <div class="wrapper">
                            <div class="name">Alex Korf</div>
                            <div class="id">@Kneepy</div>
                        </div>
                        <div class="last-visit">был(а) в сети 1 час назад</div>
                    </div>
                </div>
            </div>
        </div>
    </ModalBox>
</template>

<style scoped lang="scss">
.dialog-info {
    width: 520px;
    max-height: 90vh;
    min-height: 30vh;
    background-color: $primary_content_background;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid $border_8;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 40px;
        .title {
            flex: 1;
            color: $white;
            font-weight: 600;
            font-size: 18px;
        }
        button {
            background-color: transparent;
            border: none;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            transition: 200ms;
            flex: 0;
            &:hover {
                background-color: $transparent_button_hover_17;
                transition: 200ms;
                span {
                    color: $white;
                    transition: 200ms;
                }
            }
            span {
                color: $gray;
                font-weight: 500;
                transition: 200ms;
            }
        }
    }
    .info {
        border-bottom: 5px solid $primary_border;
        padding: 10px 30px 20px;
        .user {
            display: flex;
            align-items: center;
            &__info {
                margin-left: 20px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                .wrapper {
                    display: flex;
                    .name {
                        color: $white;
                        font-size: 20px;
                        font-weight: 600;
                    }
                    .id {
                        color: $gray_1;
                        margin-left: 10px;
                    }
                }
                .last-visit {
                    color: $gray;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>