import { defineStore } from "pinia";
import { User } from "./types/user.type";

export const useUserStore = defineStore("user", {
    state: () => ({
        tempUser: {} as User
    }),
    actions: {
        getUserBy: async (
            data: Partial<Pick<User, "email" | "userName" | "id">>
        ): Promise<User> => (await useCustomFetch("/user", {method: "GET", query: data})).data.value,

        createUser: async (
            data: Pick<User, "email" | "fullName" | "password">
        ): Promise<{user_id: string}> => (await useCustomFetch("/user", {method: "POST", body: data})).data.value
    }
})