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
                /**
                 * Вероятнее всего эти токены уже были занесены в useCustomFetch
                 * Но я тут их в любом случае добавлю
                 */
                const tokens = await UserAPI.getTokens()

                appStateStore.setAuthorization(tokens.access_token)
                appStateStore.setSession(tokens.refresh_token)

                /**
                 * Получаем образ (без всей инфы кроме email, fullName, userName и т.п) нашего пользователя
                 */
                const me = await UserAPI.getMe()
                userStore.setMe(me)

            } catch (e) {
                return navigateTo({name: ROUTES.LOGIN_INPUT_EMAIL})
            }
        }

        /**x``
         * На этом этапе токены необоходимые для подлкючения уже получены
         * Поэтому можно подключаться к WebSocket серверу
         */
        if(!Socket.isReady()) {
            Socket.init(baseWsURL, {
                authorization: appStateStore.authorization,
                fingerprint: appStateStore.fingerprint,
                session_id: appStateStore.session
            })

            Socket.on<number>(WS_EVENTS.SESSION_TOKEN, (data) => console.log(data, "callback"))

        }
    }
})
