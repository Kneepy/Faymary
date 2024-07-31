import { UserAPI, WS_EVENTS } from "~/api";
import { Socket } from "~/api/ws/socket";
import { ROUTES } from "assets/constants/routes.constants";

export default defineNuxtRouteMiddleware(async ( route    ) => {
    if (process.server) return
    if(route.meta.requiredAuth) {
        const appStateStore = useAppStateStore()
        const userStore = useUserStore()
        const { baseWsURL, sessionCookie } = useRuntimeConfig().public

        /**
         * Получаем данные пользователя и все необходимые токены авторизации
         */
        if(!appStateStore.authorization || !userStore.me) {
            try {
                userStore.me = await UserAPI.getMe()
            } catch (e) {
                return navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})
            }
        }

        /**
         * На этом этапе токены необоходимые для подлкючения уже получены
         * Поэтому можно подключаться к WebSocket серверу
         */
        if(!Socket.isReady()) {
            Socket.init(baseWsURL, {
                authorization: appStateStore.authorization,
                fingerprint: appStateStore.fingerprint,
                session_id: appStateStore.session
            })
        }
    }
})
