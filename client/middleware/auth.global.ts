import { ROUTES } from "~~/assets/constants/routes.constants"

export default defineNuxtRouteMiddleware(route => {
    if(process.server) return

    if(route.meta.requredAuth) {
        const userStore = useUserStore()
        
        userStore.getMe()
        .then(me => userStore.$patch({me}))
        .catch(() => {navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})})
    }
})