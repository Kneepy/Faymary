import { ROUTES } from "~~/assets/constants/routes.constants"

export default defineNuxtRouteMiddleware(route => {
    const appStateStore = useAppStateStore()
    
    if(
        !appStateStore.isAuth() && route.meta.requredAuth
    ) return navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})
})