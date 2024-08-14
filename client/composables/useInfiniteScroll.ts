/**
 * @param element элемент для которого надо обеспечить бесконечную прокрутку
 * @param callback функция которая будет обесепечивать получение новых данных (для удобства в него передаётся количество раз когда прокрутка достигла 80%)
 *
 * Этот хук нужен для создания бесконечной прокрутки
 * Если прокрутка будет доситгать 80% то будут callback будет получать новые данные и element будет опять удлиннятся
 * (ну как это задумывается)
 *
 * В onDestroy необходимо вызвать эту функцию повторно чтобы снять слушатель события
 *
 */
export const useInfiniteScroll = (element: HTMLElement, callback: (count: number) => void) => {
    const metadata = { scrollHeight: 0, numberTriggers: 0, callbackCompleted: false }

    const handler = (e: WheelEvent) => {
        if (!element) return

        if (metadata.scrollHeight === 0) {
            metadata.scrollHeight = -element.scrollTop
        }

        const elementHeight = element.scrollHeight - element.clientHeight
        const valueScrollHeight = metadata.scrollHeight + (-e.deltaY)

        if (valueScrollHeight > elementHeight) {
            metadata.scrollHeight = elementHeight
        }
        if (valueScrollHeight < elementHeight && valueScrollHeight > 0) {
            metadata.scrollHeight = valueScrollHeight
        }

        const percentagePassing = (metadata.scrollHeight / elementHeight) * 100

        if (percentagePassing <= 80 && metadata.callbackCompleted) {
            metadata.callbackCompleted = false
        }
        if (percentagePassing > 80 && !metadata.callbackCompleted) {
            metadata.callbackCompleted = true
            callback(metadata.numberTriggers)
            metadata.numberTriggers++
        }
    }

    element.addEventListener("wheel", handler, false)

    return () => { element.removeEventListener("wheel", handler, false) }
}