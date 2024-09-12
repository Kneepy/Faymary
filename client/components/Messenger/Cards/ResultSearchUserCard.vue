<script setup lang="ts">
import type { User } from "~/api";

const props = defineProps<{
    user: User
    isSelect: boolean
}>()
</script>

<template>
    <div :class="[`user`, props.isSelect ? `active` : ``]">
        <div class="user-info">
            <Avatar :size=40 :user-name="props.user.fullName" :href="props.user.file_id" />
            <div class="user-name">
                {{ props.user.fullName }}
                <div class="user-id">@{{ props.user.userName }}</div>
            </div>
        </div>
        <GIcon v-if="props.isSelect" :size=20 :weight=800>check</GIcon>
    </div>
</template>

<style scoped lang="scss">
.user {
    display: flex;
    color: $white;
    align-items: center;
    cursor: pointer;
    padding: 10px 15px;
    margin-bottom: 10px;
    transition: 200ms;
    border-radius: 10px;
    justify-content: space-between;
    background-color: $transparent_button_hover_17;
    &:hover, &.active {
        background-color: $transparent_panel_hover;
        opacity: 1;
        transition: 200ms;
    }
    .icon {
        color: $white;
    }
    .user-info {
        display: flex;
        align-items: center;
        .user-name {
            margin-left: 15px;
            font-weight: bold;
            font-size: 16px;
            .user-id {
                font-size: 14px;
                font-weight: 600;
                color: $gray;
            }
        }
    }
}
</style>