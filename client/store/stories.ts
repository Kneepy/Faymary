import { defineStore } from "pinia";
import { Story, UserStories } from "./types/story.type";

export const COLORS = ["rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(255, 51, 1)", "rgb(248,120,108)", "rgb(247,169,120)", "rgb(255,132,160)", "rgb(105,228,179)", "rgb(159,75,237)", "rgb(65,137,232)", "rgb(46,186,72)", "rgb(249,216,39)", "rgb(255,140,73)", "rgb(77,77,77)", "rgb(102,102,102)", "rgb(128,128,128)", "rgb(153,153,153)", "rgb(179,179,179)", "rgb(204,204,204)", "rgb(127,75,231)", "rgb(160,123,234)", "rgb(192,168,240)", "rgb(224,212,247)"]
interface Canvas {
    history: ImageData[],
    current: string
}

export const useStoriesStore = defineStore("stories", {
    state: () => ({
        stories: [] as UserStories[],
        createOptions: {
            draw: {
                color: "rgb(255, 255, 255)" as typeof COLORS[number],
                width: 100,
                opacity: 100
            },
            canvases: [] as Canvas[],
            currentCanvas: 0
        }
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