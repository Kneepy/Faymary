import type { CustomRange, Dialog, Message, User } from "~/api/interfaces";

export const DialogsAPI = {
    async getUserDialogs(params: CustomRange): Promise<Dialog[]> {
        try {
            const dialogs = useCustomFetch<Dialog[]>("/dialog/many", { method: "GET", query: params })

            return dialogs ?? []
        } catch (e) {
            console.error(e)

            return []
        }
    },
    async getDialogMessages(dialog_id: string, { take, skip }: CustomRange): Promise<Message[]> {
        try {

            const messages = await useCustomFetch<Message[]>("/dialog/messages", { method: "GET", query: { dialog_id, take, skip } })

            return messages ?? []

        } catch (e) {
            console.log(e)

            return []
        }
    },
    async searchUsersFromDialogs({ fullName, take, skip }: Pick<User, "fullName"> & CustomRange): Promise<{existing: User[], nonexistent: User[]}> {
        try {

            return await useCustomFetch<{ existing: User[], nonexistent: User[] }>("/dialog/search-users", {
                method: "GET",
                query: { fullName, take, skip }
            })

        } catch (e) {
            console.log(e)

            return { existing: [], nonexistent: [] }
        }
    }
}