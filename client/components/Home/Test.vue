<template>
    <HorizontalScroll class="stories" :count="25">
        <template #prev="{ prev, shiftIncrease, shiftReduce, scrollPosition }">
            <div 
                @mouseenter="shiftIncrease" 
                @mouseleave="shiftReduce"
                @click="prev"
                v-if="!scrollPosition.start"
                class="scroll scroll-left"
            >
                <span class="material-symbols-rounded">navigate_next</span>
            </div>
        </template>
        <template #next="{ next, shiftIncrease, shiftReduce, scrollPosition }">
            <div 
                @mouseenter="shiftIncrease" 
                @mouseleave="shiftReduce" 
                @click="next" 
                v-if="!scrollPosition.end"
                class="scroll scroll-right"
            >
                <span class="material-symbols-rounded">navigate_next</span>
            </div>
        </template>
        <template #default="{ shift }">
            <div class="stories__box">
                <Button v-for="s in 25" class="story" :key="s" :style="{transform: `translateX(${shift}px)`, backgroundImage: `url(https://source.unsplash.com/random?landscapes)`}">
                    <div class="author">
                        <div class="border">
                            <Avatar class="user-avatar" :size=35 href="https://source.unsplash.com/random?peoples" />  
                        </div>
                        <span>{{ s }}Faymary</span>
                    </div>
                </Button>
            </div>
        </template>
    </HorizontalScroll>
</template>
<style scoped lang="scss">
.stories {
    width: 100%;
    margin: 0 auto;
    border: 1px solid $border_1;
    border-radius: 20px;
    background-color: $primary_content_background;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 20px;
    position: relative;
    &::-webkit-scrollbar {
        display: none;
    }

    &__box {
        display: flex;
        .story {
            min-width: 100px;
            width: 140px;
            height: 145px;
            margin-right: 5px;
            border-radius: 10px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: relative;
            padding: 0px;
            padding-bottom: 10px;
            overflow: hidden;
            &::before {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: $transperent_hover_content_background;
                content: "";
            }
            &::after {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 110px;
                background: linear-gradient(0deg, $black 0%, transparent 100%);
                opacity: .9;
                content: "";
            }
            .author {
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                .border {
                    padding: 2px;
                    border: 2px solid $primary_blue;
                    border-radius: 50%;
                    width: fit-content;
                    .user-avatar {
                        border-radius: 50%;
                    }
                }
                span {
                    color: $white;
                    font-size: 13px;
                    overflow: hidden;
                    font-weight: 500;
                    max-width: 60px;
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
</style>