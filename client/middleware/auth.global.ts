import { ROUTES } from "~~/assets/constants/routes.constants"

export default defineNuxtRouteMiddleware(route => {
    if(process.server) return

    const userStore = useUserStore()

    if(route.meta.requredAuth) {
        userStore.getMe()
        .then(me => userStore.me = me)
        .catch(() => {navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})})
    }
})