import type { CustomRange, Dialog } from "~/api/interfaces";

export const DialogsAPI = {
    async getUserDialogs(params: CustomRange): Promise<Dialog[]> {
        try {
            const dialogs = useCustomFetch<Dialog[]>("/dialog/many", { method: "GET", query: params })

            return dialogs ?? []
        } catch (e) {
            console.error(e)
            return []
        }
    }
}