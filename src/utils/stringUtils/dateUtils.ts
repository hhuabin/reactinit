/**
 * @description 日期格式化
 * @param { string | Date | number } value 需要格式化的值
 * @param { string } fmt 日期格式
 * @returns { string }
 * @example formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss')
 */
export const formatDate = (value: string | Date | number, fmt = 'YYYY-MM-DD hh:mm:ss'): string => {
    let date: Date
    try {
        if (typeof value === 'string' && value.constructor === String) {
            // ios 不支持 - 连接故而需要使用 /
            date = new Date(value.replace(/T/g, ' ').replace(/-/g, '/'))
        } else if (value instanceof Object && value.constructor === Date) {
            date = value
        } else if (typeof value === 'number' && value.constructor === Number) {
            date = new Date(value)
        } else {
            throw new Error('日期格式化失败，请传入正确的格式')
        }
        if (isNaN(date.getTime())) throw new Error('日期格式化失败，请传入正确的格式')
    } catch (error) {
        console.error(error)
        return value.toString()
    }

    const weekList = ['日', '一', '二', '三', '四', '五', '六']
    const fmtobj: Record<string, string> = {
        'M+': String(date.getMonth() + 1),
        'D+': String(date.getDate()),
        'h+': String(date.getHours()),
        'm+': String(date.getMinutes()),
        's+': String(date.getSeconds()),
        'w+': weekList[date.getDay()],
    }
    if (/(Y+)/.test(fmt)) {
        const yearLength = (fmt.match(/(Y+)/) as RegExpMatchArray)[0].length
        fmt = fmt.replace(/(Y+)/, String(date.getFullYear()).substring(4 - yearLength))
    }
    for (const key in fmtobj) {
        const reg = new RegExp(`(${key})`)
        if (reg.test(fmt)) {
            const str = fmtobj[key]
            const eleLength = (fmt.match(reg) as RegExpMatchArray)[0].length
            fmt = fmt.replace(reg, (eleLength === 1 ? str : str.padStart(2, '0')))
        }
    }
    return fmt
}

/**
 * 获取当前时区指定时间的对应的北京时间
 * @param date 日期，默认值：当前时刻
 * @param fmt 返回的日期格式，默认值：YYYY-MM-DD hh:mm:ss
 * @returns { string } YYYY-MM-DD hh:mm:ss
 */
export const getBeijingTime = (date: string | Date | number = new Date(), fmt = 'YYYY-MM-DD hh:mm:ss'): string => {
    try {
        if (typeof date === 'string' && date.constructor === String) {
            // ios 不支持 - 连接故而需要使用 /
            date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/'))
        // eslint-disable-next-line no-empty
        } else if (date instanceof Object && date.constructor === Date) {
            // do nothing
        } else if (typeof date === 'number' && date.constructor === Number) {
            date = new Date(date)
        } else {
            throw new Error('getBeijingTime date 参数错误')
        }
        if (isNaN(date.getTime())) throw new Error('getBeijingTime date 参数错误')
    } catch (error) {
        console.error(error)
        return date.toString()
    }

    // 2. 转换为北京时间（UTC+8）
    const beijingTime = new Date(date.getTime() + (8 * 60 * 60 * 1000))

    // 3. 格式化为 YYYY-MM-DD hh:mm:ss
    const fmtobj: Record<string, string> = {
        'M+': String(beijingTime.getUTCMonth() + 1),
        'D+': String(beijingTime.getUTCDate()),
        'h+': String(beijingTime.getUTCHours()),
        'm+': String(beijingTime.getUTCMinutes()),
        's+': String(beijingTime.getUTCSeconds()),
    }
    if (/(Y+)/.test(fmt)) {
        const yearLength = (fmt.match(/(Y+)/) as RegExpMatchArray)[0].length
        fmt = fmt.replace(/(Y+)/, String(beijingTime.getUTCFullYear()).substring(4 - yearLength))
    }
    for (const key in fmtobj) {
        const reg = new RegExp(`(${key})`)
        if (reg.test(fmt)) {
            const str = fmtobj[key]
            const eleLength = (fmt.match(reg) as RegExpMatchArray)[0].length
            fmt = fmt.replace(reg, (eleLength === 1 ? str : str.padStart(2, '0')))
        }
    }
    return fmt
}


/**
 * 判断当前时区时间是否早于目标时区时间
 * @example isEarlierInTimezone(Date.now(), new Date().getTimezoneOffset(), '2025-07-07 17:00:00', -480)
 * @param { string | Date | number } currentTime 当前时区时间，默认值：Date.now()
 * @param { number } currentTimezoneOffset 当前时区对于 UTC 的“反向”偏移值[ -840, +720 ]；默认值：new Date().getTimezoneOffset()
 * @param { string | Date | number } targetTime 目标时区时间，默认值：Date.now()
 * @param { number } targettimezoneOffset 目标时区对于 UTC 的“反向”偏移值[ -840, +720 ]；默认值：东八区（北京） -480
 * @returns { boolean } true早于目标时间，false晚于或等于目标时间
 */
export const isEarlierInTimezone = (
    currentTime: string | Date | number = Date.now(),
    currentTimezoneOffset: number = new Date().getTimezoneOffset(),     // 当前时区相对于 UTC 的“反向”偏移值
    targetTime: string | Date | number = Date.now(),
    targettimezoneOffset: number = -480,         // 默认是东八区对于 UTC 的“反向”偏移值
): boolean => {
    if (typeof currentTime === 'string' && currentTime.constructor === String) {
        // ios 不支持 - 连接故而需要使用 /
        currentTime = new Date(currentTime.replace(/T/g, ' ').replace(/-/g, '/'))
    // eslint-disable-next-line no-empty
    } else if (currentTime instanceof Object && currentTime.constructor === Date) {
        // do nothing
    } else if (typeof currentTime === 'number' && currentTime.constructor === Number) {
        currentTime = new Date(currentTime)
    } else {
        throw new Error('isEarlierInTimezone currentTime 参数错误')
    }

    if (typeof targetTime === 'string' && targetTime.constructor === String) {
        // ios 不支持 - 连接故而需要使用 /
        targetTime = new Date(targetTime.replace(/T/g, ' ').replace(/-/g, '/'))
    // eslint-disable-next-line no-empty
    } else if (targetTime instanceof Object && targetTime.constructor === Date) {
        // do nothing
    } else if (typeof targetTime === 'number' && targetTime.constructor === Number) {
        targetTime = new Date(targetTime)
    } else {
        throw new Error('isEarlierInTimezone targetTime 参数错误')
    }

    if (targettimezoneOffset < -840 || targettimezoneOffset > 720) {
        throw new Error('isEarlierInTimezone targettimezoneOffset 参数错误')
    } else if (currentTimezoneOffset < -840 || currentTimezoneOffset > 720) {
        throw new Error('isEarlierInTimezone currentTimezoneOffset 参数错误')
    }

    // 1. 将当前时间转换为 UTC 时间戳（自动计算时区偏移）
    const currentUTCTimestamp = currentTime.getTime() + (currentTimezoneOffset * 60 * 1000)
    // 2. 将目标时间转换为 UTC 时间戳（自动计算时区偏移）
    const targetUTCTimestamp = targetTime.getTime() + (targettimezoneOffset * 60 * 1000)

    if (isNaN(currentUTCTimestamp) || isNaN(targetUTCTimestamp)) {
        throw new Error('isEarlierInTimezone 日期参数错误')
    }
    if (currentUTCTimestamp - targetUTCTimestamp < 0) {
        // 早于目标时间
        return true
    }
    return false
}
