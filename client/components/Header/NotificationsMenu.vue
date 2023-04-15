<script setup lang="ts">
import { ROUTES } from '~~/assets/constants/routes.constants';
import { NotificationEnumType } from '~~/store/types/notification.type';

const notificationsStore = useNotificationStore()
const emit = defineEmits(['close'])
const closeEmit = () => emit("close")

/** 
 * Этот компонент нужно доделывать когда считай весь проект уже будет сделан
 */
if(!notificationsStore.notifications.length) {
    notificationsStore.notifications = await notificationsStore.getNotifications({take: 10, skip: 0})
}
</script>
<template>
    <div class="notifications__menu">
        <div class="title">
            <span>Уведомления</span>
            <NuxtLink @click="closeEmit" :to="{name: ROUTES.SETTINGS}"><span>Настройки</span></NuxtLink>
        </div>
        <div class="notifications__menu__container">
            <Button v-for="notification in notificationsStore.notifications" class="notification">
                <Avatar :size=45 :href="notification.from.file_id" />
                <div class="notification__info">
                    <div v-if="notification.notification_type === NotificationEnumType.SUB_USER"  class="subscribe">
                        Пользователь @{{ notification.from.userName }} подписался на вас
                    </div>
                </div>
            </Button>
        </div>
        <NuxtLink @click="closeEmit" :to="{name: ROUTES.SETTINGS}"><Button class="show-all">Показать всё</Button></NuxtLink>
    </div>
</template>
<style scoped lang="scss">
.notifications__menu {
    position: absolute;
    background-color: $primary_content_background;
    border: 1px solid $primary_border;
    border-radius: 10px;
    right: 0;
    min-width: 400px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    .title {
        padding: 8px 15px;
        color: $white;
        font-weight: 600;
        border-bottom: 1px solid $primary_border;
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        a {
            color: $white;
        }
    }
    &__container {
        max-height: 400px;
        min-height: 200px;
        overflow: auto;
        flex-grow: 1;
        .notification {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid $primary_border;
            border-radius: 0px;
            text-align: left;
            background-color: transparent;
            color: $white;
            font-size: 15px;
            font-weight: 500;
            min-height: 75px;
            &:hover {
                background-color: $transparent_button_hover;
            }
            &__info {
                margin-left: 10px;
            }
        }
        &::-webkit-scrollbar {
            background-color: transparent;
            width: 5px;
            position: absolute;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba($gray, 0.5);
            border-radius: 10px;
            position: absolute;
            transition: 200ms;
            &:hover{
                background-color: rgba($gray, 1);
                transition: 200ms;
                width: 10px;
            }
        }
    }
    .show-all {
        background-color: transparent;
        color: $white;
        font-size: 14px;
        font-weight: 400;
        box-shadow: 0px -1px 0px $primary_border;
        border-radius: 0px 0px 10px 10px;
        &:hover {
            background-color: $transparent_button_hover;    
        }
    }
}
</style>