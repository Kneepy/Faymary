import { UseFetchOptions } from "nuxt/app"

export const useCustomFetch = (href: string, data: UseFetchOptions<any>) => useFetch(href, {
    async onRequest({ options }) {
        const appStateStore = useAppStateStore()

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
         * Следующая строчка кода не нужна т.к BE сам устанавливает cookie файлы + nuxt не видит те куки которые устанавливает сервак
         * 
         * appStateStore.refresh_token = useCookie(config.public.sessionCookie).value
         */
        const appStateStore = useAppStateStore()
        appStateStore.authorization = response.headers.get("authorization") as string ?? appStateStore.authorization
    },
    server: false,
    baseURL: useRuntimeConfig().public.baseApiURL,
    ...data,
})