/**
 * @param unix время в формате UNIX (Date.now())
 * Эта функция преобразует время в количество часов дней и т.п сколько прошло с момента указанного в аргументе
 */
enum MillisecondsPer {
    seconds = 1000,
    minutes = MillisecondsPer.seconds * 60,
    hours = MillisecondsPer.minutes * 60,
    days = MillisecondsPer.hours * 24,
    months = MillisecondsPer.days * 30,
    years = MillisecondsPer.months * 365,
}

interface TimeOptions {
    exactTime?: boolean
}

const rule = (time: number, period: MillisecondsPer) => {
    const lastNumber = time % 100 > 20 ? time % 10 : time % 100

    if ([1].includes(lastNumber)) {
        switch (period) {
            case MillisecondsPer.seconds: return `${time} секунду`
            case MillisecondsPer.minutes: return `${time} минуту`
            case MillisecondsPer.hours: return `${time} час`
            case MillisecondsPer.days: return `${time} день`
            case MillisecondsPer.months: return `${time} месяц`
            case MillisecondsPer.years: return `${time} год`
        }
    }
    if ([2, 3, 4].includes(lastNumber)) {
        switch (period) {
            case MillisecondsPer.seconds: return `${time} секунды`
            case MillisecondsPer.minutes: return `${time} минуты`
            case MillisecondsPer.hours: return `${time} часа`
            case MillisecondsPer.days: return `${time} дня`
            case MillisecondsPer.months: return `${time} месяца`
            case MillisecondsPer.years: return `${time} года`
        }
    }
    if ([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(lastNumber)) {
        switch (period) {
            case MillisecondsPer.seconds: return `${time} секунд`
            case MillisecondsPer.minutes: return `${time} минут`
            case MillisecondsPer.hours: return `${time} часов`
            case MillisecondsPer.days: return `${time} дней`
            case MillisecondsPer.months: return `${time} месяцев`
            case MillisecondsPer.years: return `${time} лет`
        }
    }
}

/**
 * @param unix Date.now()
 * @param options Взависимости от этого будет изменятся формат вывода (напр. 2 часа назад или 15.08.2024 в 13:51)
 * Выводит количество времени прошедшее с момента переданного в аргументе (2 дня, 3 года и т.п)
 */
export const useTime = (unix: number | string, options?: TimeOptions): string => {
    if (typeof unix === "string") unix = Number(unix);

    const date = new Date(unix)
    const difference = Date.now() - unix;
    const seconds = Math.floor(difference / MillisecondsPer.seconds);
    const minutes = Math.floor(difference / MillisecondsPer.minutes);
    const hours = Math.floor(difference / MillisecondsPer.hours);
    const days = Math.floor(difference / MillisecondsPer.days);
    const mouths = Math.floor(difference / MillisecondsPer.months);
    const years = Math.floor(difference / MillisecondsPer.years);


    if (options?.exactTime) {
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return `${day}.${month}.${date.getFullYear()} в ${hours}:${minutes}`
    }
    else {
        const result = (() => {
            if (years !== 0) return rule(years, MillisecondsPer.years);
            if (mouths !== 0) return rule(mouths, MillisecondsPer.months);
            if (days !== 0) return rule(days, MillisecondsPer.days);
            if (hours !== 0) return rule(hours, MillisecondsPer.hours);
            if (minutes !== 0) return rule(minutes, MillisecondsPer.minutes);
            if (seconds !== 0) return rule(seconds, MillisecondsPer.seconds);
        })()

        return result ? `${result} назад` : "только что";
    }
};