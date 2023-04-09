<template>
    <div class="faymary">
        <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
}
input, button {
    outline: none;
}
</style>