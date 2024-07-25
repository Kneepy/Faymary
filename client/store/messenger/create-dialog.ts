import { defineStore } from "pinia";
import type { CreateDialog } from "~/store/messenger/types";

export const useCreateDialogStore = defineStore("create-dialog", {
    state: (): CreateDialog.Store => ({
        selectedUsers: [],
        resultSearch: [],
        inputSearch: "",
        message: "",
        files: []
    }),
    actions: {
        /**
         * Обновляет результаты поиска
         * @param users новые результаты поиска
         */
        setResultSearch(users: CreateDialog.IUser[]) {
            this.resultSearch = users ?? [];
        },

        /**
         * Выбирает пользователя при создании диалога
         * @param user выбранный пользователь
         */
        selectUser(user: CreateDialog.IUser) {
            this.selectedUsers.push(user);
        },

        /**
         * Удаляет пользователя из выбранныз при создании диалога
         * @param user выбранный пользователь
         */
        removeUser(user: CreateDialog.IUser) {
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

        attachFile(file: File) {
            this.files.push(file);
        },
        removeFile(file: File) {
            const indexFile = this.files.indexOf(file);
            this.files.splice(indexFile, 1);
        }
    }
})