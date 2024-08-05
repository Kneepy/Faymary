import { defineStore } from "pinia";
import type { CreateDialog } from "~/store/messenger/types";

export const useCreateDialogStore = defineStore("create-dialog", {
    state: (): CreateDialog.Store => ({
        selectedUsers: [],
        resultSearch: {
            existing: [],
            nonexistent: []
        },
        inputSearch: "",
        message: "",
        files: []
    }),
    actions: {
        /**
         * Обновляет результаты поиска
         * @param users новые результаты поиска
         */
        setResultSearch({ existing, nonexistent }: { existing: CreateDialog.CustomUser[]; nonexistent: CreateDialog.CustomUser[] }) {
            if (existing?.length > 0) this.resultSearch.existing = existing
            if (nonexistent?.length > 0) this.resultSearch.nonexistent = nonexistent
        },

        /**
         * Выбирает пользователя при создании диалога
         * @param user выбранный пользователь
         */
        selectUser(user: CreateDialog.CustomUser) {
            this.selectedUsers.push(user);
        },

        /**
         * Удаляет пользователя из выбранныз при создании диалога
         * @param user выбранный пользователь
         */
        removeUser(user: CreateDialog.CustomUser) {
            const index = this.selectedUsers.indexOf(user);

            if (index !== -1) {
                this.removeUserByIndex(index)
            }

            return
        },

        /**
         * Изменяет сообщение которое будет использовано при создании диалога
         * @param msg новое сообщение
         */
        setMessage(msg: string) {
            this.message = msg.trim();
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
        removeFileByIndex(index: number) {
            this.files.splice(index, 1);
        },
        removeFile(file: File) {
            const indexFile = this.files.indexOf(file);
            this.files.splice(indexFile, 1);
        }
    }
})