import { defineStore } from "pinia";
import { DraftsMessages } from "~/store";
import { type Addition, type Message, StoreAPI } from "~/api";

export const useDraftsMessagesStore = defineStore("drafts-messages", {
    state: (): DraftsMessages.Store => ({
        drafts: []
    }),
    actions: {
        addDraft(dialog_id: string) {
            const existDraft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (existDraft) return existDraft

            const newDraft = { message: "", files: [], dialog_id, originalMessage: null }
            this.drafts.push(newDraft as any)

            return newDraft
        },
        getDraft(dialog_id: string) {
            return this.drafts.find(draft => draft.dialog_id === dialog_id) ?? this.addDraft(dialog_id);
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

            draft.files.push(Object.assign(file, { href: URL.createObjectURL(file) }))
        },
        removeFile(dialog_id: string, file: DraftsMessages.CustomFile) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            const indexFile = draft.files.indexOf(file)

            if (indexFile === -1) return

            draft.files.splice(indexFile, 1)
        },
        removeFileRef(dialog_id: string, ref: DraftsMessages.CustomFileRef) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            const indexFile = draft.fileRefs.indexOf(ref)

            if (indexFile === -1) return

            draft.fileRefs.splice(indexFile, 1)
        },
        setOriginalMessage(dialog_id: string, message: Message) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            draft.originalMessage = message
        },
        removeOriginalMessage(dialog_id: string) {
            return this.setOriginalMessage(dialog_id, null as any)
        },
        clear(dialog_id: string) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            draft.files = []
            draft.message = ""
            draft.originalMessage = null
        },
        setDraftByMessage(dialog_id: string, message: Message) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            if (!draft) return

            draft.message = message.msg

            if (Object.keys(message.attachments).length > 0) {
                draft.originalMessage = !!message.attachments?.messages?.length ? message.attachments?.messages[0] : null
                draft.fileRefs = []

                for (const file of (message.attachments.files ?? [])) {
                    draft.fileRefs.push(Object.assign(file, { href: useFile(file.id) }))
                }
            }
        },
        isEmpty(dialog_id: string) {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)

            return !!draft?.files?.length || !!draft?.message
        },
        async prepareMessage(dialog_id: string, edits?: Partial<DraftsMessages.Draft>): Promise<DraftsMessages.PreparedMessage> {
            const draft = this.drafts.find(draft => draft.dialog_id === dialog_id)
            const attachments: Addition = {}

            if (!draft) return
            if (draft.files.length) {
                attachments.files = await StoreAPI.uploadFiles(draft.files)
            }
            if (Object.keys(draft.originalMessage ?? {}).length) {
                attachments.messages = [ draft.originalMessage ]
            }

            /**
             * Это нужно в тех случаях если в качестве id указан ANONIMOUS_DIALOG при создании нового диалога
             */
            if (!!edits?.dialog_id) dialog_id = edits.dialog_id

            return { dialog_id, msg: draft.message, attachments }
        }
    }
})