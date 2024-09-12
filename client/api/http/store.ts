import { type File as CustomFile } from "~/api"

export const StoreAPI = {
    /**
     * Файлы отправляются с пометкой в formData file и files соответственно
     */
    async uploadFile(file: File): Promise<CustomFile> {
        try {
            const fd = new FormData()
            fd.append("file", file)

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
    async uploadFiles(files: File[]): Promise<CustomFile[]> {
        try {
            const fd = new FormData()

            files.forEach((file: File) => fd.append("files", file))

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
            return []
        }
    }
}