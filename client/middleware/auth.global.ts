import { UserAPI } from "~/api"
import { ROUTES } from "~~/assets/constants/routes.constants"

export default defineNuxtRouteMiddleware(route => {
    if(route.meta.requredAuth) {
        const appStateStore = useAppStateStore()
        const userStore = useUserStore()

        const authMe = async () => {
            try {
                userStore.me = await UserAPI.getMe()
            } catch (e) {
                navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})
            }
        }
        if(!appStateStore.authorization || !userStore.me) {
            authMe().then(() => {})
        }
    }
})
