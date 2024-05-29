import { useRef } from 'react'

export default class FunctionUtil {
	// 非组件函数使用时使用, 此时 timer 在全局生效，全局只能执行一个 debounce
	// private static timer: NodeJS.Timeout | null = null
	// private static lastTime = Date.now();

	/**
	 * 防抖函数： 一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
	 * @param { Function } callback 回调函数
	 * @param { Number } delay 延迟时间
	 * @returns 
	 */
	public static debounce = <T>(callback: (...args: Array<T>) => void, delay = 500) => {
		// 一个函数绑定一个 timer 可以分开执行
		// let timer: NodeJS.Timeout | null = null
		const timer = useRef<NodeJS.Timeout | null>(null)
		return (...args: Array<T>) => {
			clearTimeout((timer.current as NodeJS.Timeout))
			timer.current = setTimeout(() => {
				callback(...args)
			}, delay);
		}
	}

	/**
	 * 函数节流：一个函数执行完后只有大于设定时间才会再次执行第二次  (节约浏览器资源)
	 * @param { Function } callback 回调函数
	 * @param { Number } delay 延迟时间
	 * @returns 
	 */
	public static throttle = <T>(callback: (...args: Array<T>) => void, delay = 200) => {
		// let lastTime = Date.now()
		const lastTime = useRef(Date.now())
		return (...args: Array<T>) => {
			const nowTime = Date.now()
			if (nowTime - lastTime.current > delay) {
				callback(...args)
				lastTime.current = nowTime
			}
		}
	}
}
