import { UseFetchOptions } from "nuxt/app"

export const useCustomFetch = async (href: string, data: UseFetchOptions<any>) => await useFetch(href, {
    async onRequest({options}) {
        const config = useRuntimeConfig()
        const appStateStore = useAppStateStore()

        options.baseURL = config.public.baseURL
        options.headers = {
            ...data.headers,
            authorization: `Bearer ${appStateStore.authorization}`,
            fingerprint: await useNuxtApp().$fingerprint,
        } as HeadersInit
        this.credentials = "include"
    },
    async onResponse(ctx) {
        // я не знаю что делать это чудо заголовки отправленные с сервера не видит
        ctx.response.headers.forEach((v, i) => console.log(i, v))
    },
    ...data
})