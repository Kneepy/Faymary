import { UseFetchOptions } from "nuxt/app"

export const useCustomFetch = async (href: string, data: UseFetchOptions<any>) => await useFetch(href, {
    async onRequest({options}) {
        const config = useRuntimeConfig()
        options.baseURL = config.public.baseURL
        options.headers = {
            authorization: `Bearer ${useCookie("refresh_token").value}`,
            fingerprint: await useNuxtApp().$fingerprint,
            ...data.headers
        } as HeadersInit
    },
    ...data
})