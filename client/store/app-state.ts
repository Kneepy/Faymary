import { defineStore } from "pinia";

export const useAppStateStore = defineStore("appStateStore", {
    state: () => ({
        load: false                                
    })
})