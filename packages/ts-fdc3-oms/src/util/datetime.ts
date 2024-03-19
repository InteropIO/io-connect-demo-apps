const MS_PER_DAY = 1000 * 60 * 60 * 24

export const DateAddDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export const DateAddSeconds = (date: Date, seconds: number): Date => {
    const result = new Date(date)
    result.setUTCSeconds(result.getUTCSeconds() + seconds)
    return result
}

export const DateStartOfDay = (date: Date): Date => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

export const DateEndOfDay = (date: Date): Date => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
}

export const DateGetDaysSpan = (from: Date, to: Date): number => {
    const diff = DateStartOfDay(to).getTime() - DateStartOfDay(from).getTime()
    return Math.round(diff / MS_PER_DAY) // rounding needed in case the dates span over a DST change
}

export const DateIsValid = (date: Date | undefined): boolean => {
    if (date) {
        return !isNaN(date.getTime())
    }
    return false
}

export const DateIsSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1 &&
        date2 &&
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    )
}

export const DateFromStringOrDate = (
    date: Date | string | undefined
): Date | undefined => {
    let result: Date | undefined = undefined
    if (date) {
        if (date instanceof Date) {
            DateIsValid(date) && (result = date)
        } else if (typeof date === 'string') {
            const myDate = new Date(date)
            DateIsValid(myDate) && (result = myDate)
        }
    }
    return result
}

export const MDateAddDays = (date: Date, days: number): void => {
    date.setDate(date.getDate() + days)
}

export const MDateAddSeconds = (date: Date, seconds: number): void => {
    date.setUTCSeconds(date.getUTCSeconds() + seconds)
}
