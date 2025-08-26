/* https://github.com/react-component/util/blob/master/src/hooks */
import { useEffect, useRef, useState } from 'react'

type StateAction<T> = T | ((prevState: T) => T);

export type SetStateAction<T> = (
    stateAction: StateAction<T>,
    ignoreDestroy?: boolean,
) => void;

/**
 * @description 自定义 useState Hook
 * 功能：安全的 useState。使用与 React.useState 相同，仅增加了避免组件卸载后依然调用 setState 的功能
 * useSafeState`接受 ignoreDestroy 参数，当 ignoreDestroy = true 时，组件销毁后不会更新状态，避免内存泄漏
 * 开发者需要手动设置 ignoreDestroy，不设置默认为 false，此时与 React.useState 使用方式一摸一样
 * @example const [a, setA] = useSafeState(0); setA(1, true)
 */
function useSafeState<T>(defaultValue: T | (() => T)): [T, SetStateAction<T>]
function useSafeState<T>(): [T | undefined, SetStateAction<T | undefined>]
function useSafeState<T>(
    defaultValue?: T | (() => T),
): [T, SetStateAction<T>] {
    const destroyRef = useRef(false)
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        destroyRef.current = false

        return () => {
            destroyRef.current = true
        }
    }, [])

    const safeSetState = (stateAction: StateAction<T>, ignoreDestroy?: boolean) => {
        // 避免组件卸载后依然调用 setState
        if (ignoreDestroy && destroyRef.current) return
        setValue(stateAction as StateAction<T | undefined>)
    }

    return [value as T, safeSetState]
}

export default useSafeState
