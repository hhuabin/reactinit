/**
 * @description 获取一个区间内的值
 * @param { number } num 需要处理的值
 * @param { number } min 区间最小值
 * @param { number } max 区间最大值
 * @returns { number } [min, max] 之间的值
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

/**
 * @description 获取一个区间内的随机整数
 * @param { number } min 区间最小整数
 * @param { number } max 区间最大整数
 * @returns { number } 区间内的随机整数
 */
export const randomIntInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
