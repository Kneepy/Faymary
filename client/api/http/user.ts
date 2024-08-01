import type { AuthTokens, Profile, CustomRange, User, UserId, Users } from "~/api/interfaces";

export const UserAPI = {
    async getUserBy(data: Partial<Pick<User, "email" | "userName" | "id">>) {
        return await useCustomFetch("/user", {method: "GET", query: data})
    },
    async getUsersBy(data: Partial<Pick<User, "userName" | "fullName">> & CustomRange): Promise<User[]> {
        const users = await useCustomFetch<User[]>("/user/search", {method: "GET", query: data})
        return users ?? []
    },
    async getMe(): Promise<User> {
        return await useCustomFetch<User>("/user/me", {method: "GET"})
    },
    async getMeProfile(): Promise<Profile> {    
        return await useCustomFetch<Profile>("/user/me/profile", {method: "GET"})
    },
    async changeAccount(account_id: string): Promise<AuthTokens> {
        return await useCustomFetch<AuthTokens>("/user/change-account", {method: "PATCH", query: {account_id}})
    },
    async sendConfirmCode(data: Pick<User, "email"> & UserId): Promise<UserId> {
        return await useCustomFetch<UserId>("/user/send-confirm-code", {method: "POST", body: data})
    },
    async createUser(data: Pick<User, "email" | "fullName" | "password">): Promise<UserId> {
        return await useCustomFetch<UserId>("/user", {method: "POST", body: data})
    },
    async loginUser(data: Pick<User, "email" | "password">): Promise<UserId> {
        return await useCustomFetch<UserId>("/user/login", {method: "PUT", body: data})
    },
    async confirmUser({user_id, code}: {user_id: string, code: string}): Promise<AuthTokens> {
        return await useCustomFetch<AuthTokens>("/user/confirm", {method: "PUT", query: {user_id, code}})
    },
    async getTokens(): Promise<AuthTokens> {
        return await useCustomFetch("/user/auth", {method: "POST"})
    }
}