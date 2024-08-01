import { defineStore } from "pinia";
import { type User } from "~/api/interfaces";

interface UserStore {
    tempUser: Partial<User>
    me: Partial<User>
}

export const useUserStore = defineStore("user", {
    state: (): UserStore => ({
        tempUser: {},
        me: {}
    }),
    actions: {
        setMe(user: User) {
            this.me = user
        }
    }
})