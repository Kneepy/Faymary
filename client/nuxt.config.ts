export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            baseApiURL: process.env.BASE_API_URL,
            baseWsURL: process.env.BASE_WS_URL,
            filesApiURL: process.env.FILES_API_URL,
            sessionCookie: process.env.SESSION_COOKIE,
        }
    },
    ssr: true,
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
