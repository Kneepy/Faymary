import { defineStore } from "pinia";
import { Story } from "./types/story.type";

export const useStoriesStore = defineStore("stories", {
    actions: {
        async getStory({id}: Pick<Story, "id">): Promise<Story> {
            return (await useCustomFetch("/story", {method: "GET", query: {id}})).data.value
        }
    }
})