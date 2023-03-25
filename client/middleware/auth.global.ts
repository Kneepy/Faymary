import { ROUTES } from "~~/assets/constants/routes.constants"

export default defineNuxtRouteMiddleware(route => {
    if(
        //!userStore.isAuth() && route.meta.requredAuth
        false
    ) return navigateTo({name: ROUTES.LOGIN})
})