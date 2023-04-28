import { defineStore } from "pinia";
import { Story, UserStories } from "./types/story.type";

export const useStoriesStore = defineStore("stories", {
    state: (): {stories: UserStories[]} => ({
        stories: []
    }),
    actions: {
        async getStory({id}: Pick<Story, "id">): Promise<Story> {
            return (await useCustomFetch("/story", {method: "GET", query: {id}})).data.value
        },
        async getCollectionStories({take, skip}): Promise<UserStories[]> {
            const res = await useCustomFetch("/story/me-collection", {method: "GET", query: {take, skip}})

            if(res.error.value?.data) throw res.error.value?.data

            return res.data.value
        }
    }
})