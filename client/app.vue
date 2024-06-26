<template>
    <div class="faymary">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<style lang="scss">
* {
    margin: 0;
    padding: 0;
    font-family: $primary_fonts;
}
a {
    text-decoration: none;
}
body {
    background-color: $primary_background;
    display: grid;
}
input, button {
    outline: none;
}
</style>