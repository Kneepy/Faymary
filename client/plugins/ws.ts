export default defineNuxtPlugin(() => {
    const appStateStore = useAppStateStore()

    if(process.server) return

    const socket = null //new WebSocket(useRuntimeConfig().public.baseWsURL)
   
    return {
        provide: {socket}
    }
})