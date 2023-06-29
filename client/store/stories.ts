import { defineStore } from "pinia";
import { UserStories } from "~/api/interfaces";

export const COLORS = ["rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(255, 51, 1)", "rgb(248,120,108)", "rgb(247,169,120)", "rgb(255,132,160)", "rgb(105,228,179)", "rgb(159,75,237)", "rgb(65,137,232)", "rgb(46,186,72)", "rgb(249,216,39)", "rgb(255,140,73)", "rgb(77,77,77)", "rgb(102,102,102)", "rgb(128,128,128)", "rgb(153,153,153)", "rgb(179,179,179)", "rgb(204,204,204)", "rgb(127,75,231)", "rgb(160,123,234)", "rgb(192,168,240)", "rgb(224,212,247)"]
interface Canvas {
    history?: ImageData[]
    // изображение toDataUrl текущего холста
    current?: string
    file?: {
        filename: string
        id: string
        user_id: string
        extname: string
        createdAt: number
    }
}

export const useStoriesStore = defineStore("stories", {
    state: () => ({
        stories: [] as UserStories[],
        createOptions: {
            draw: {
                color: "rgb(255, 255, 255)" as typeof COLORS[number],
                width: 20,
                opacity: 100
            },
            canvases: [] as Canvas[],
            currentCanvas: 0,
        }
    }),
    actions: {
        deleteCanvas(canvas_id: number) {
            if(this.createOptions.canvases.length > 2) {
                this.createOptions.canvases.splice(canvas_id, 1)
                this.createOptions.currentCanvas = canvas_id >= 1 ? canvas_id - 1 : this.createOptions.canvases.length - 1
            } else {
                console.log("нельзя удалить холс если их меньше двух!")
            }
        }
    }
})