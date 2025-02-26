/**
 * 把一个值限制在一个上限和下限 ([min, max]) 之间
 * @param { number } num 需要处理的值
 * @param { number } min 区间最小值
 * @param { number } max 区间最大值
 * @returns { number }
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)
