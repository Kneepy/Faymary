import { UseFetchOptions } from "nuxt/app"

export const useCustomFetch = async (href: string, data: UseFetchOptions<any>) => await useFetch(href, {
    async onRequest({ options }) {
        const config = useRuntimeConfig()
        const appStateStore = useAppStateStore()

        options.baseURL = config.public.baseApiURL
        options.headers = {
            ...data.headers,
            authorization: `Bearer ${appStateStore.authorization}`,
            fingerprint: await useNuxtApp().$fingerprint,
        } as HeadersInit
        this.credentials = "include"
        this.mode = "cors"
    },
    async onResponse({ response }) {
        /**
         * Мы при каждом ответе изменяем эти заголовоки т.к они могут меняться взависимости от времени 
         */
        const appStateStore = useAppStateStore()
        const config = useRuntimeConfig()
        appStateStore.authorization = response.headers.get("authorization") as string
        appStateStore.refresh_token = useCookie(config.public.sessionCookie).value
    },
    ...data
})