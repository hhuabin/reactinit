/**
 * @deprecated React 中弃用该方法，请使用 Hooks 版的 useThrottle 和 useDebounce
 */
/**
 * @Author: bin
 * @Date: 2025-02-26 21:05:44
 * @LastEditors: bin
 * @LastEditTime: 2025-11-13 09:40:53
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ThrottleDebounce {
    // 非组件函数使用时使用, 此时 timerId 在全局生效，全局只能执行一个 debounce
    // private static timerId: NodeJS.Timeout | null = null
    // private static lastTime = Date.now()

    /**
     * @description 非 React 防抖函数： 一个需要频繁触发的函数，在规定时间内触发，只让最后一次生效，前面的不生效
     * @param { Function } callback 回调函数
     * @param { number } delay 延迟时间
     * @param { boolean } immediate 立即执行
     * @returns { Function } debounce 防抖函数
     * @example const debounced = useCallback(ThrottleDebounce.debounce(() => {}, 1000), [dependencies])
     */
    public static debounce = <T extends (...args: any[]) => void>(callback: T, delay = 500, immediate = false) => {
        // 一个函数绑定一个 timerId 可以分开执行
        // 在 React 中，debounce 的每次状态更新，timerId 都会被重置为 null，导致上一个还未发生的 timerId 无法被 clear
        let timerId: ReturnType<typeof setTimeout> | null = null
        const debounced = (...args: Parameters<T>) => {
            console.group('debounced')
            console.log(`定时器值为 ${timerId}`)
            if (timerId) clearTimeout(timerId)
            if (immediate) {
                const callNow = !timerId
                if (callNow) callback(...args)
                timerId = setTimeout(() => {
                    timerId = null
                }, delay)
            } else {
                timerId = setTimeout(() => {
                    callback(...args)
                    // 在 React 函数组件中，this 通常没有明确的意义，此处省略处理 this 的逻辑
                    // callback.call(this, ...args)
                    console.log(`%ctimerId: ${timerId} 执行了`, 'color: red; font-weight: bold;')
                    timerId = null
                }, delay)
            }
            console.log(`定时器 ${timerId} 创建了`)
            console.groupEnd()
        }

        // 取消防抖执行，可在组件卸载时执行
        debounced.cancel = () => {
            if (timerId) {
                clearTimeout(timerId)
                timerId = null
            }
        }

        return debounced
    }

    /**
     * @description 非 React 函数节流：一个函数执行完后只有大于设定时间才会再次执行第二次  (节约浏览器资源)
     * @param { Function } callback 回调函数
     * @param { number } delay 延迟时间
     * @returns { Function } throttled节流函数
     * @example const throttle = useCallback(ThrottleDebounce.throttle(() => {}, 1000), [dependencies])
     */
    public static throttle = <T extends (...args: any[]) => void>(callback: T, delay = 200) => {
        let lastTime = Date.now()
        return (...args: Parameters<T>) => {
            const nowTime = Date.now()
            if (nowTime - lastTime > delay) {
                callback(...args)
                // callback.apply(this, args)
                lastTime = nowTime
            }
        }
    }
}
