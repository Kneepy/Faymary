import { defineStore } from "pinia";
import { Comment } from "./types/comment.type";

export const useCommentsStore = defineStore("comments", {
    actions: {
        async getComment({id}: Pick<Comment, "id">): Promise<Comment> {
            return (await useCustomFetch("/comment", {method: "GET", query: {id}})).data.value
        }
    }
})