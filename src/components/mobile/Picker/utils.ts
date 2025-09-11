import type { PickerOption, PickerColumn } from './Picker.d'

// 判断是否为多列
export const isMultiColumn = (cols: PickerOption[] | PickerOption[][]) => Array.isArray(cols) && Array.isArray(cols[0])

// 获取中间的数字
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

// 获取 PickerColumn 的 children 深度
export const getPickerColumnDepth = (columns: PickerColumn): number => {
    if (!columns || columns.length === 0) return 0

    let maxChildDepth = 0
    for (const option of columns) {
        if (option.children && !!option.children.length) {
            const childDepth = getPickerColumnDepth(option.children)
            if (childDepth > maxChildDepth) {
                maxChildDepth = childDepth
            }
        }
    }

    return 1 + maxChildDepth
}
