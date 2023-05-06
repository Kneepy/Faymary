import { defineStore } from "pinia";
import { Post } from "./types/post.type";

export const usePostsStore = defineStore("posts", {
    actions: {
        async getPost({id}: Pick<Post, "id">): Promise<Post> {
            return (await useCustomFetch("/post", {method: "GET", query: {id}})).data.value
        }
    }
})