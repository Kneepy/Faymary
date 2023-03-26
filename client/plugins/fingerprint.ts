import fingerprint from "@fingerprintjs/fingerprintjs"

export default defineNuxtPlugin(() => {
    if(process.server) return
    
    return {
        provide: {fingerprint: (async () => (await (await fingerprint.load()).get()).visitorId)()}
    }
})