<script setup lang="ts">
const userStore = useUserStore()
const userAvatar = useFile(userStore.me.file_id)
</script>
<template>
    <StoriesButton :file-id="userStore.me.file_id">
        <div class="create__story__bth">
            <div class="avatar" :style="{backgroundImage: `url(${userAvatar})`}">
            </div>
            <div class="add_bth">
                <Button class="add_bth__icon">
                    <span class="material-symbols-rounded">add</span>
                </Button>
                Историю
            </div>
        </div>
    </StoriesButton>
</template>
<style scoped lang="scss">
 .create__story__bth {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .avatar {
        filter: blur(5px);
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
    }
    .add_bth {
        position: absolute;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-weight: 500;
        color: $white;
        font-size: 14px;
        &__icon {
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-bottom: 5px;
            span {
                font-weight: 500;
                font-size: 28px;
                color: $black;
            }
        }
    }
}
</style>