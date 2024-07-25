import { defineStore } from "pinia";
import type { CreateDialog } from "~/store/messenger/types";

export const useCreateDialogStore = defineStore("create-dialog", {
    state: (): CreateDialog.Store => ({
        selectedUsers: [],
        resultSearch: [],
        inputSearch: "",
        message: ""
    }),
    actions: {
        setResultSearch(users: CreateDialog.IUser[]) {
            this.resultSearch = users ?? [];
        },
        selectUser(user: CreateDialog.IUser) {
            this.selectedUsers.push(user);
        },
        removeUser(user: CreateDialog.IUser) {
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