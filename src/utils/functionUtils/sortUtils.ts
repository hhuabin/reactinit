/**
 * @description 1. 二路归并排序，该方法会 改变原数组 也可以返回新的数组
 * @param { T[] } array 需要排序的数组
 * @param { Function } compareFn 排序规则，a - b 为增序，b - a 为降序
 * @returns { T[] } 排序后的数组
 * @example mergeSort([1, 5, 2, 6, 3, 7, 4], (a, b) => a - b)
 * @example mergeSort(array, ({ index: a }, { index: b }) => a - b)
 * @tips 时间复杂度：O(nlog2n)、空间复杂度：O(n)
 */
export const mergeSort = <T>(array: T[], compareFn: (a: T, b: T) => number): T[] => {
    const copy = new Array<T>(array.length)

    const sort = (left: number, right: number) => {
        if (left < right) {
            const mid = Math.floor((left + right) / 2)

            sort(left, mid)
            sort(mid + 1, right)

            // 合并两个已排序的部分
            let i = left, j = mid + 1, k = left
            // 哪个小就先放在temp中
            while (i <= mid && j <= right) {
                copy[k++] = compareFn(array[i], array[j]) <= 0 ? array[i++] : array[j++]
            }
            // 复制剩余元素
            while (i <= mid) copy[k++] = array[i++]
            while (j <= right) copy[k++] = array[j++]

            // 复制 copy 到 array
            for (let p = left; p <= right; p++) {
                array[p] = copy[p]
            }
        }
    }

    sort(0, array.length - 1)
    return copy
}


/**
 * @description 2. 快速排序，该方法会 改变原数组 也可以返回新的数组
 * @param { T[] } array 需要排序的数组
 * @param { Function } compareFn 排序规则，a - b 为增序，b - a 为降序
 * @returns { T[] } 排序后的数组
 * @example quickSort([1, 5, 2, 6, 3, 7, 4], (a, b) => a - b)
 * @example quickSort(array, ({ index: a }, { index: b }) => a - b)
 * @tips 时间复杂度：O(nlog2n)，最坏复杂度O(n^2)、空间复杂度：O(n)，最坏复杂度O(nlog2n)
 * @tips 当每次的基准值都是中间的时候，速度最优，当总体是有序的，速度最差
 */
export const quickSort = <T>(array: T[], compareFn: (a: T, b: T) => number): T[] => {
    const copy = new Array<T>(array.length)
    const sort = (low: number, high: number) => {
        const temp = array[low]
        let i = low, j = high

        while (i < j) {
            // 对比右侧
            while (i < j && compareFn(temp, array[j]) <= 0) j--

            if (i < j) {
                array[i] = array[j]
                i++
            }

            // 对比左侧
            while (i < j && compareFn(array[i], temp) < 0) i++

            if (i < j) {
                array[j] = array[i]
                j--
            }
        }
        array[i] = temp
        if (low < i) sort(low, i - 1)
        if (i < high) sort(j + 1, high)
    }

    sort(0, array.length - 1)
    console.log(array)

    return array
}
