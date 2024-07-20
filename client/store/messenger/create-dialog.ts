import { defineStore } from "pinia";
import type { CreateDialogInterface } from "~/store/messenger/types";
import type { User } from "~/api";

export const useCreateDialogStore = defineStore("create-dialog", {
    state: (): CreateDialogInterface => ({
        selectedUsers: [],
        resultSearch: [],
        inputSearch: "",
        message: ""
    }),
    actions: {
        setResultSearch(users: User[]) {
            this.resultSearch = users ?? [];
        },
        selectUser(user: User) {
            this.selectedUsers.push(user);
        },
        removeUser(user: User) {
            const index = this.selectedUsers.indexOf(user);

            if (index !== -1) {
                this.removeUserByIndex(index)
            }

            return
        },
        removeUserByIndex(index: number) {
            this.selectedUsers.splice(index, 1);
        }
    }
})