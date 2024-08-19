/**
 * По факту та самя реакция для сообщений
 */
export interface LikesCollection {
    id: string
    unity: string // это символ реакции\лайка типа клоун, демон, сердечко там или любой другой символ
    number_likes: number
    has_liked: boolean // содержится ли лайк пользователя в этой коллекции
}