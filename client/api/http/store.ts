import { File } from "~/api"

export const StoreAPI = {
    /**
     * Файлы отправляются с пометкой в formData file и files соответственно
     */
    async uploadFile(fd: FormData): Promise<File> {
        try {
            const { filesApiURL } = useRuntimeConfig().public
            const userStore = useUserStore()

            return await useCustomFetch(filesApiURL, {
                method: "POST",
                body: fd,
                query: { user_id: userStore.me.id }
            })
        } catch (e) {
            console.error(e)
        }
    },
    async uploadFiles(fd: FormData): Promise<File[]> {
        try {
            const { filesApiURL } = useRuntimeConfig().public
            const uploadURL = new URL("multiply", filesApiURL)
            const userStore = useUserStore()

            return await useCustomFetch(uploadURL.toString(), {
                method: "POST",
                body: fd,
                query: { user_id: userStore.me.id }
            })
        } catch (e) {
            console.error(e)
        }
    }
}