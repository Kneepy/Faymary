<template>
    <div class="header">
        <div class="header__container">
            <NuxtLink :to="{name: ROUTES.HOME}">
                <Logo :size=60 />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ROUTES } from '~~/assets/constants/routes.constants';

</script>

<style scoped lang="scss">
.header {
    height: 70px;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: $primary_content_background;
    border-bottom: 1px solid $primary_border;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .header__container {
        width: 1400px;
        margin: 0 auto;
    }
}
</style>