import { defineStore } from "pinia";
import { DraftsMessages } from "~/store";

export const useDraftsMessagesStore = defineStore("drafts-messages", {
    state: (): DraftsMessages.Store => ({
        drafts: []
    }),
    actions: {
        addDraft(dialog_id: string) {
            const existDraft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (existDraft) return

            const newDraft = { message: "", files: [], dialog_id }
            this.drafts.push(newDraft)

            return newDraft
        },
        getDraft(dialog_id: string) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id) ?? this.addDraft(dialog_id)

            return {
                ...draft,
                setMessage: (message: string) => this.setMessage(draft.dialog_id, message),
                addFile: (file: File) => this.addFile(draft.dialog_id, file),
                removeFile: (file: File) => this.removeFile(draft.dialog_id, file),
                removeFileByIndex: (index: number) => this.removeFileByIndex(draft.dialog_id, index),
                prepareMessage: () => this.prepareMessage(draft.dialog_id)
            };
        },
        setMessage(dialog_id: string, message: string) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            draft.message = message
        },
        addFile(dialog_id: string, file: File) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return
            if (!draft.files) draft.files = []

            draft.files.push(file)
        },
        removeFile(dialog_id: string, file: File) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            const indexFile = draft.files.indexOf(file)

            if (indexFile === -1) return

            draft.files.splice(indexFile, 1)
        },
        removeFileByIndex(dialog_id: string, index: number) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return
            if (!draft.files[index]) return

            draft.files.splice(index, 1)
        },
        async prepareMessage(dialog_id: string): Promise<DraftsMessages.PrepareMessage> {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return
            if (draft.files.length) {

            }

            return
        }
    }
})