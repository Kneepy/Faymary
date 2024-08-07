import { defineStore } from "pinia";
import type { CreateDialog } from "~/store/messenger/types";

export const useCreateDialogStore = defineStore("create-dialog", {
    state: (): CreateDialog.Store => ({
        selectedUsers: [],
        resultSearch: {
            existing: [],
            nonexistent: []
        },
        inputSearch: ""
    }),
    actions: {
        /**
         * Обновляет результаты поиска
         * @param users новые результаты поиска
         */
        setResultSearch({ existing, nonexistent }: { existing: CreateDialog.User[]; nonexistent: CreateDialog.User[] }) {
            if (existing?.length > 0) this.resultSearch.existing = existing
            if (nonexistent?.length > 0) this.resultSearch.nonexistent = nonexistent
        },

        /**
         * Выбирает пользователя при создании диалога
         * @param user выбранный пользователь
         */
        selectUser(user: CreateDialog.User) {
            this.selectedUsers.push(user);
        },

        /**
         * Удаляет пользователя из выбранныз при создании диалога
         * @param user выбранный пользователь
         */
        removeUser(user: CreateDialog.User) {
            const index = this.selectedUsers.indexOf(user);

            if (index !== -1) {
                this.removeUserByIndex(index)
            }

            return
        },

        /**
         * Удаляет пользователя из выбранныз при создании диалога по его индексу
         * @param index index выбранного пользователя (в массиве this.selectedUsers)
         */
        removeUserByIndex(index: number) {
            this.selectedUsers.splice(index, 1);
        },
    }
})