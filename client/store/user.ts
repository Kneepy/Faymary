import { defineStore } from "pinia";
import { User, UserId } from "./types/user.type";

export const useUserStore = defineStore("user", {
    state: () => ({
        tempUser: {} as User
    }),
    actions: {
        async getUserBy (data: Partial<Pick<User, "email" | "userName" | "id">>): Promise<User> {
            return (await useCustomFetch("/user", {method: "GET", query: data})).data.value
        },
        async sendConfirmCode(data: Pick<User, "email"> & UserId): Promise<UserId> {
            return (await useCustomFetch("/user/send-confirm-code", {method: "POST", body: data})).data.value
        },
        async createUser(data: Pick<User, "email" | "fullName" | "password">): Promise<UserId> {
            const res = await useCustomFetch("/user", {method: "POST", body: data})

            if(res.error.value?.data) throw res.error.value?.data
            return res.data.value
        },
        async loginUser(data: Pick<User, "email" | "password">): Promise<UserId> {
            const res = await useCustomFetch("/user/login", {method: "PUT", body: data})
            
            if(res.error.value?.data) throw res.error.value?.data
            return res.data.value
        },
        async confirmUser({user_id, code}: {user_id: string, code: string}): Promise<{access_token: string, refresh_token: string}> {
            const res = await useCustomFetch("/user/confirm", {method: "PUT", query: {user_id, code}})

            if(res.error.value?.data) throw res.error.value.data

            // я хз что делать оно почему-то cookie не устанавливает, как и те что приходят с сервера
            const config = useRuntimeConfig()
            const cookie = useCookie<string>(config.public.sessionCookie, {httpOnly: true, secure: true, maxAge: 1209600, path: "/"})
            cookie.value = res.data.value.refresh_token

            return res.data.value
        }
    }
})