import { Story, UserStories } from "./interfaces"

export const StoriesAPI = {
    async getStory({id}: Pick<Story, "id">): Promise<Story> {
        return await useCustomFetch<Story>("/story", {method: "GET", query: {id}})
    },
    async getCollectionStories({take, skip}): Promise<UserStories[]> {
        return await useCustomFetch<UserStories[]>("/story/me-collection", {method: "GET", query: {take, skip}})
    },
    async test() {
        return await useCustomFetch<any>("/user/test", {})
    },
    async publishedStories(): Promise<any> {
        /*this.createOptions.canvases.forEach(async canvas => {
            const blob = base64ToBlob(canvas.current)
            const fd = new FormData()
            fd.append("file", blob)

            canvas.file = (await useCustomFetch("/", {
                method: "POST",
                body: fd,
                baseURL: useRuntimeConfig().public.filesApiURL,
                query: {
                    user_id: useUserStore().me.id
                }
            })).data.value
        })*/
    }
}