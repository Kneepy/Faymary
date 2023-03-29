import { UseFetchOptions } from "nuxt/app"

export const useCustomFetch = async (href: string, data: UseFetchOptions<any>) => await useFetch(href, {
    onRequest({options}) {
        const config = useRuntimeConfig()
        options.baseURL = config.public.baseURL
        options.headers = {
            authorization: `Bearer ${useCookie("refresh_token").value}`,
            ...data.headers
        } as HeadersInit
    },
    ...data
})