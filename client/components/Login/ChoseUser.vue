<script setup lang="ts">
defineEmits<{
    (e: "done", done: boolean): void
}>()
</script>
<template>
    <div class="chose__user">
        <button class="user">
            <Avatar :size=50 href="https://source.unsplash.com/random" />
            <div class="user__info">
                <div class="user__info__name">Ilya Famin</div>
                <div class="user__info__id">@Fama</div>
            </div>
        </button>
        <div class="answer">
            <Button class="answer__no" @click="$emit(`done`, true)" :disabled="false">Нет</button>
            <Button class="answer__yes" @click="$emit(`done`, true)" :disabled="false">Да</button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.chose__user {
    .user {
        display: flex;
        align-items: center;
        background-color: $primary_content_background;
        padding: 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: 200ms;
        opacity: .8;
        width: 100%;
        border: none;
        &:hover {
            transition: 200ms;
            opacity: 1;
        }
        &__info {
            margin-left: 10px;
            font-size: 16px;
            color: $white;
            &__name {
                font-weight: bold;
            }
            &__id {
                color: $gray;
                font-size: 14px;
                text-align: left;
            }
        }
    }
    .answer {
        display: flex;
        justify-content: space-around;
        margin-top: 40px;
        button {
            background-color: $white;
            border-radius: 8px;
            padding: 7px 0;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: 100ms;
            width: 120px;
            color: $white;
            opacity: 1;
            transition: 100ms;
            &:hover {
                opacity: .8;
                transition: 100ms;
            }
            &.answer__yes {
                background-color: $green;
            }
            &.answer__no {
                background-color: $red;
            }
        }
    }
}
</style>