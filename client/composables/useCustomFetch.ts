import { UseFetchOptions } from "nuxt/app"

/**
 * Если запрос прошёл успешно то результатом будет ответ 
 * Иначе же будет выдана ошибка которую можно отловить в trycatch
 */
export const useCustomFetch = <DataT>(href: string, data: UseFetchOptions<any>): Promise<DataT> => $fetch<DataT>(href, {
    async onRequest({ options }) {
        const appStateStore = useAppStateStore()

        options.headers = {
            ...data.headers,
            authorization: `Bearer ${appStateStore.authorization}`,
            fingerprint: await useNuxtApp().$fingerprint,
        } as HeadersInit
        options.credentials = "include"
        options.mode = "cors"
        options.baseURL = useRuntimeConfig().public.baseApiURL as string
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
    async onResponseError({ response, options }) {
        throw response._data
    },
    /**
     * Ругается на Enum Methods поэтому всё придётся пометить как any
     */
    ...data as any,
})