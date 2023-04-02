export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            baseURL: "http://localhost:5000/",
            imgesURL: "http://localhost:5013/",
            sessionCookie: "refresh_token"
        }
    },
    ssr: true,
    target: 'server',
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
