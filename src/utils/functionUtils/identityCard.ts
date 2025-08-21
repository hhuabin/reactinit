/**
 * @description 居民身份证号码格式校验，默认使用第二代身份证校验
 * @param { string } idCardNumber 身份证号码
 * @param { boolean } enableFirst 是否开启第一代身份证校验
 * @returns { boolean } true 通过校验；false 校验失败
 * @example validateIdentityCard('111111111111111111', true)
 */
const validateIdentityCard = (idCardNumber: string, enableFirst = false): boolean => {
    if (typeof idCardNumber !== 'string') return false

    if (enableFirst && idCardNumber.length === 15) {
        // 15位身份证开启第一代身份证检验
        return validateFirstIdCard(idCardNumber)
    }
    return validateSecondIdCard(idCardNumber)
}

/**
 * @description 第一代居民身份证号码格式校验
 * @rule 1999年之前发放：6位地区码 + 6位出生日期（YYMMDD） + 3位顺序码（无校验码，15位是性别），共15位
 * @param { string } idCardNumber 15位身份证号码
 * @returns { boolean } true 通过校验；false 校验失败
 * @example validateFirstIdCard('111111111111111')
 */
const validateFirstIdCard = (idCardNumber: string): boolean => {
    if (typeof idCardNumber !== 'string') return false

    const pattern = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}/
    const reg = new RegExp(pattern)
    if (!reg.test(idCardNumber)) return false

    // 补全年份为19xx
    const [year, month, day] = [+('19' + idCardNumber.substring(6, 8)), +idCardNumber.substring(8, 10), +idCardNumber.substring(10, 12)]
    const date = new Date(year, month - 1, day)
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) return false

    return true
}

/**
 * @description 第二代居民身份证号码格式校验
 * @rule 6位地区码 + 8位出生日期（YYYYMMDD） + 3位顺序码（17位是性别） + 1位校验码，共18位
 * @param { string } idCardNumber 18位身份证号码
 * @returns { boolean } true 通过校验；false 校验失败
 * @example validateSecondIdCard('111111111111111111')
 */
const validateSecondIdCard = (idCardNumber: string): boolean => {
    if (typeof idCardNumber !== 'string') return false

    // 计算支持年份，从二十世纪至今
    let supportYear = '19'
    const maxSupportYear = Math.floor(new Date().getFullYear() / 100)
    for (let year = 20; year <= maxSupportYear; year++) {
        supportYear += `|${year}`
    }
    const pattern = `^([1-6][1-9]|50)\\d{4}(${supportYear})\\d{2}((0[1-9])|1[0-2])(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$`
    const reg = new RegExp(pattern)
    if (!reg.test(idCardNumber)) return false

    // 验证日期
    const [year, month, day] = [+idCardNumber.substring(6, 10), +idCardNumber.substring(10, 12), +idCardNumber.substring(12, 14)]
    const date = new Date(year, month - 1, day)
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) return false

    // 校验位权重
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    // 校验码对应值
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    // 计算校验码
    const sum = weights.reduce((prev, current, index) => prev + current * +idCardNumber.charAt(index), 0)
    const checkCode = checkCodes[sum % 11]

    // 验证校验码
    return checkCode === idCardNumber.charAt(17).toUpperCase()
}

export {
    validateIdentityCard,
    validateFirstIdCard,
    validateSecondIdCard,
}
export default validateIdentityCard
