import { defineStore } from "pinia";
import { User } from "./types/user.type";

export const useUserStore = defineStore("user", {
    state: () => ({
        tempUser: {} as User
    }),
    actions: {
        getUserByEmail: async (data: Partial<Pick<User, "email" | "userName" | "id">>): Promise<User> => (await useCustomFetch("/user", {method: "GET", query: data})).data.value 
    }
})