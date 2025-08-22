import { useEffect, useRef, useState } from 'react'

type StateAction<T> = undefined | T | ((prevState: T | undefined) => T | undefined);
// type StateAction<T> = T | ((prevState: T) => T)

export type SetState<T> = (
    state: StateAction<T>,
    ignoreDestroy?: boolean,
) => void;

/**
 * @description 安全的 useState：与 React.useState 相同，仅增加了避免组件卸载后依然调用 setState 的功能
 * useSafeState`接受 ignoreDestroy 参数，当 ignoreDestroy = true 时，组件销毁后不会更新状态，避免内存泄漏
 * 开发者需要手动设置 ignoreDestroy，不设置默认为 false，此时与 React.useState 使用方式一摸一样
 * @example const [a, setA] = useSafeState(0); setA(1, true)
 */
const useSafeState = <T>(
    defaultValue?: T | (() => T),
): [T, SetState<T>] => {
    const destroyRef = useRef(false)
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        destroyRef.current = false

        return () => {
            destroyRef.current = true
        }
    }, [])

    const safeSetState = (state: StateAction<T>, ignoreDestroy?: boolean) => {
        // 避免组件卸载后依然调用 setState
        if (ignoreDestroy && destroyRef.current) return
        setValue(state)
    }

    return [value as T, safeSetState]
}

export default useSafeState
