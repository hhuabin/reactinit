/**
 * @description 日期格式化
 * @param { string | Date | number } value 需要格式化的值
 * @param { string } fmt 日期格式
 * @returns { string }
 * @example formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss')
 */
const formatDate = (value: string | Date | number, fmt = 'YYYY-MM-DD hh:mm:ss'): string => {
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
    } catch (error) {
        console.warn(error)
        return value.toString()
    }

    const weekList = ['日', '一', '二', '三', '四', '五', '六']
    const fmtobj: Record<string, number | string> = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'w+': weekList[date.getDay()],
    }
    if (/(Y+)/.test(fmt)) {
        const yearLength = (fmt.match(/(Y+)/) as RegExpMatchArray)[0].length
        fmt = fmt.replace(/(Y+)/, (date.getFullYear() + '').substring(4 - yearLength))
    }
    for (const key in fmtobj) {
        const reg = new RegExp(`(${key})`)
        if (reg.test(fmt)) {
            const str = fmtobj[key] + ''
            const eleLength = (fmt.match(reg) as RegExpMatchArray)[0].length
            fmt = fmt.replace(reg, (eleLength === 1 ? str : str.padStart(2, '0')))
        }
    }
    return fmt
}

export default formatDate
