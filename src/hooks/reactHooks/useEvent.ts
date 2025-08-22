/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useRef } from 'react'

/**
 * @description 该 hook 功能与 useCallback 一样，但解决 useCallback 的闭包问题，保持 useCallback 的函数内部逻辑总是使用最新的 state/props
 * 个人觉得该 hook 不应该叫 useEvent（React 官方 RFC 提出的一个想法）
 * 因为它的功能是：稳定引用 + 最新闭包；叫 useStableCallback 可能会更好
 * @param { Function } callback 回调函数
 * @param { React.DependencyList } deps 依赖数组，默认是[]。是否启用依赖数据，取决于 useCallback 的返回值是否需要发生变化
 * 比如当 useEvent() 返回值传递给子组件当参数时，启用 deps 可以让子组件更新
 * @returns { T } 返回 useCallback 的返回值（即函数（地址））
 */
const useEvent = <T extends Function>(callback: T, deps?: React.DependencyList): T => {
    const fnRef = useRef<T>()
    // 最新闭包：重点代码，每次渲染都会执行。重新定义 fnRef.current = callback，即可获取最新闭包值
    fnRef.current = callback

    /**
     * 稳定引用：创建一个 稳定引用 的函数 memoFn，依赖是空数组 []，所以这个 memoFn 在整个生命周期内一直是等于 fnRef.current
     */
    const memoFn = useCallback<T>(
        ((...args: any) => fnRef.current?.(...args)) as any,
        deps ?? [],
    )

    return memoFn
}

export default useEvent
