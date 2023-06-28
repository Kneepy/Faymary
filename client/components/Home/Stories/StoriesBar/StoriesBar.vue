<script setup lang="ts">
import { StoriesAPI } from '~/api/stories'

const storiesStore = useStoriesStore()
const visibleButtons = ref(false)
const openCreateStoryModal = ref(false)

const toggleCreateStoryModal = () => openCreateStoryModal.value = !openCreateStoryModal.value

storiesStore.stories = await StoriesAPI.getCollectionStories({take: 10, skip: 0})
</script>
<template>
    <div class="stories-bar">
        <HorizontalScroll @mouseleave="() => visibleButtons = false" @mouseenter="() => visibleButtons = true" class="stories" :count="storiesStore.stories?.length + 1">
            <template #default="{ shift }">
                <div class="stories__box">
                    <CreateStoryButton :style="{transform: `translateX(${shift}px)`}" @click="toggleCreateStoryModal" />
                    <CreateStoryModal v-if="openCreateStoryModal" @onClose="toggleCreateStoryModal" />

                    <UserStoryButton
                        v-for="story in storiesStore.stories" 
                        :key="story.user.id" 
                        :user="story.user" 
                        :first-story="story.stories[0]" 
                        :style="{transform: `translateX(${shift}px)`}"
                    />
                </div>
            </template>
            <template #prev="{ prev, shiftIncrease, shiftReduce, visible }">
                <div 
                    @mouseenter="shiftIncrease" 
                    @mouseleave="shiftReduce"
                    @click="prev"
                    v-if="visible"
                    class="scroll scroll-left"
                >
                    <span class="material-symbols-rounded">navigate_next</span>
                </div>
            </template>
            <template #next="{ next, shiftIncrease, shiftReduce, visible }">
                <div 
                    @mouseenter="shiftIncrease" 
                    @mouseleave="shiftReduce" 
                    @click="next" 
                    v-if="visible"
                    class="scroll scroll-right"
                >
                    <span class="material-symbols-rounded">navigate_next</span>
                </div>
            </template>
        </HorizontalScroll>
    </div>
</template>
<style scoped lang="scss">
.stories-bar {
    width: 100%;
    .stories {
        width: 100%;
        margin: 0 auto;
        border: 1px solid $border_1;
        border-radius: 20px;
        background-color: $primary_content_background;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 17px;
        position: relative;
        &::-webkit-scrollbar {
            display: none;
        }

        &__box {
            display: flex;
            .story {
                width: 169px; // 140px; 212px
                height: 145px;
                margin-right: 5px;
                border-radius: 10px;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                display: flex;
                align-items: flex-end;
                justify-content: flex-start;
                position: relative;
                padding: 0px;
                overflow: hidden;
                &::before {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: $transperent_hover_content_background;
                    transition: background-color 100ms ease-out;
                    content: "";
                }
                &::after {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 110px;
                    background: linear-gradient(0deg, $black 0%, transparent 100%);
                    opacity: .9;
                    transition: background-color 100ms ease-out;
                    content: "";
                }
                &:hover {
                    &::before {
                        background-color: $transperent_hover_content_background_2;
                        transition: background-color 100ms ease-out;
                    }
                    &::after {
                        background: linear-gradient(0deg, $black 10%, transparent 100%);
                        transition: background-color 100ms ease-out;
                    }
                }
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
            }
        }
        .scroll {
            position: absolute;
            top: 0;
            height: 100%;
            width: 40px;
            background-color: transparent;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.scroll-left {
                left: 0;
                span {
                    transform: rotate(180deg);
                }
            }
            &.scroll-right {
                right: 0;
            }
            span {
                color: $white;
                font-size: 65px;
                font-weight: 300;
            }
        }
    }
}
</style>