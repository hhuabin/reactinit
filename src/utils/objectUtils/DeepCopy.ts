export default class DeepCopy {

    /**
     * 优点：可以处理更复杂的数据结构，如嵌套对象、数组、Date、RegExp 等。
     *       不会丢失非 JSON 数据类型（例如函数、undefined 等）
     * 缺点：实现起来较复杂，容易出错，特别是处理循环引用和其他边缘情况时需要额外逻辑
     */
    /**
     * @description 循环递归深复制函数
     * @param { T } obj
     * @returns { T }
     */
    public static deepCopy = <T>(obj: T): T => {
        if (obj === null || typeof obj !== 'object') {
            return obj
        }

        const copy = (Array.isArray(obj) ? [] : {}) as T

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = DeepCopy.deepCopy(obj[key])
            }
        }

        return copy
    }

    /**
     * 优点：速度更快，处理简单数据类型
     * 缺点：不支持函数、undefined、Date、RegExp 等特殊对象。使用 JSON.stringify() 会丢失这些值
     */
    /**
     * @description JSON转换深复制函数
     * @param { T } obj
     * @returns { T }
     */
    public static deepCopyWithJSON = <T>(obj: T): T => {

        return JSON.parse(JSON.stringify(obj))

    }
}
