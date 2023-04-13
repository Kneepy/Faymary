<script setup lang="ts">
const notificationsStore = useNotificationStore()

/** 
 * Этот компонент нужно доделывать когда считай весь проект уже будет сделан
 */
if(!notificationsStore.notifications.length) {
    notificationsStore.notifications = await notificationsStore.getNotifications({take: 10, skip: 0})
}
</script>
<template>
    <div class="notifications">
        <div class="notifications__container">
            <div class="notification">
                <Avatar :size=60 :href="``" />
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.notifications {
    width: 100%;
    position: absolute;
    background-color: $primary_content_background;
    border: 1px solid $primary_border;
    border-radius: 10px;
    &__container {
        padding: 20px;
    }
}
</style>