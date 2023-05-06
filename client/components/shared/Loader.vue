<template>
    <div class="loader">
        <div class="loader__spin">
            <div class="loader__spin__points">
                <div class="point"></div>
                <div class="point"></div>
            </div>
            <div class="loader__spin__points">
                <div class="point"></div>
                <div class="point"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loader {
    position: absolute;
    width: 100%;
    background-color: rgba(0, 0, 0, .1);
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &__spin {
        width: 40px;
        height: 40px;
        background-color: $white;        
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation-name: rotate;
        animation-duration: 1.3s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        &__points {
            .point {
                width: 6px;
                height: 6px;
                background-color: $black;
                border-radius: 50%;
                margin: 6px 3px;
            }
        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>