import { ROUTES } from "~~/assets/constants/routes.constants"

/**
 * Нужен во время создания пользователя, чтобы пользователи минувшие страницу ввода почты не могли пройти дальше (т.е если в tempUser отсутсвует email)
 */
export default defineNuxtRouteMiddleware(() => {
    const { tempUser } = useUserStore()

    if(!tempUser.email) return navigateTo({name: ROUTES.LOGIN})
})