import { defineStore } from "pinia";
import { AuthTokens, Profile, User, UserId } from "./types/user.type";

export const useUserStore = defineStore("user", {
    state: (): {tempUser: Partial<User>, me: Partial<User>} => ({
        tempUser: {},
        me: {}
    }),
    actions: {
        async getUserBy (data: Partial<Pick<User, "email" | "userName" | "id">>): Promise<User> {
            return (await useCustomFetch("/user", {method: "GET", query: data})).data.value
        },
        async getMe(): Promise<User> {
            const res = await useCustomFetch("/user/me", {method: "GET", server: false})

            if(res.error.value?.data) throw res.error.value?.data
            return res.data.value
        },
        async getMeProfile(): Promise<Profile> {    
            return (await useCustomFetch("/user/me/profile", {method: "GET"})).data.value
        },
        async changeAccount(account_id: string): Promise<AuthTokens> {
            const res = await useCustomFetch("/user/change-account", {method: "PATCH", query: {account_id}})

            if(res.error.value?.data) throw res.error.value?.data
            return res.data.value
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
        async confirmUser({user_id, code}: {user_id: string, code: string}): Promise<AuthTokens> {
            const res = await useCustomFetch("/user/confirm", {method: "PUT", query: {user_id, code}})

            if(res.error.value?.data) throw res.error.value.data

            const appStateStore = useAppStateStore()
            appStateStore.authorization = res.data.value.access_token

            return res.data.value
        }
    }
})