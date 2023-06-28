<script setup lang="ts">
import { User, Story } from '~/api';

const props = defineProps<{
    user: User
    firstStory: Story
}>()
</script>
<template>
    <StoriesButton :file-id="props.firstStory.file_id" class="user-story-bth">
        <div class="author">
            <div class="border">
                <Avatar class="user-avatar" :size=30 :href="props.user.file_id" />  
            </div>
            <span>{{ props.user.fullName }}</span>
        </div>
    </StoriesButton>
</template>
<style scoped lang="scss">
.author {
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    margin-left: 15px;
    margin-bottom: 10px;
    .border {
        padding: 3px;
        border: 2.5px solid $primary_blue;
        border-radius: 50%;
        width: fit-content;
        .user-avatar {
            border-radius: 50%;
            margin-top: -1px;
        }
    }
    span {
        color: $white;
        font-size: 13px;
        overflow: hidden;
        font-weight: 500;
        max-width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>