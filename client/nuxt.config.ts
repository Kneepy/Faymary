export default defineNuxtConfig({
    modules: [
        "@pinia/nuxt",
    ],
    imports: {
        dirs: ['store'],
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/theme.scss" as *;'
                }
            }
        }
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
})
