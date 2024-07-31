import md5 from "md5"

export default defineNuxtPlugin(() => {
    if(process.server) return


    /**
     *
     */
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#f00'
    ctx.fillRect(10, 10, 50, 50)

    ctx.fillStyle = '#0f0'
    ctx.fillRect(70, 70, 50, 50)

    ctx.fillStyle = '#00f'
    ctx.fillRect(130, 130, 50, 50)

    ctx.font = "50px Areal"
    ctx.fillText("Fayamry Fingerprint", 0, 130)

    const dataURL = canvas.toDataURL()
    const fingerprint = md5(dataURL).toString()

    return {
        provide: {
            /**
             * Можно использовать библиотеку fingerprint:
             * (async () => (await (await fingerprint.load()).get()).visitorId)()
             *
             * Но я остановлюсь на отабрежнии шришфтов в canvas можно в теории ещё добавить соль из user-agent
             */
            fingerprint
        }
    }
})