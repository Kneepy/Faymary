export default defineNuxtPlugin(() => {
    if(process.server) return

    const socket = new WebSocket("ws://localhost:5000")
   
    return {
        provide: {socket}
    }
})