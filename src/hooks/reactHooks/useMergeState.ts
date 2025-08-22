/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect } from 'react'

import useEvent from './useEvent'
import useSafeState from './useSafeState'

type SetState<T> = (
    state: undefined | T | ((prevState: T | undefined) => T | undefined),
    ignoreDestroy?: boolean,
) => void;

/** We only think `undefined` is empty */
const hasValue = (value: any) => {
    return value !== undefined
}

/**
 * @description 可受控/非受控状态合并管理 Hook
 * 常用于组件可以通过 value 受控，当不传 value 可以使用内部状态非受控（受控模式（传了 value）；非受控模式（没有传 value））
 * @param { T | (() => T) } defaultStateValue 非受控状态的默认值（初始化时使用）
 * @param option 可选对象
 * @type T 传入 state 类型
 * @type R 返回 state 类型（可能经过 postState() 处理）
 */
const useMergedState = <T, R = T>(
    defaultStateValue: T | (() => T),
    option?: {
        defaultValue?: T | (() => T);     // 非受控状态的默认值（优先于 defaultStateValue）
        value?: T;                        // 受控值，如果存在则内部状态会被覆盖
        onChange?: (value: T, prevState: T) => void;    // 内部状态变化自动调用，保存前一个值，参数有：最新的状态值、上一次的状态值
        postState?: (value: T) => T;      // 对 最终值 做加工/转换（比如格式化）
    },
): [R, SetState<T>] => {
    const { defaultValue, value, onChange, postState } = option || {}

    // =================== 初始化内部状态 ====================
    const [innerValue, setInnerValue] = useSafeState<T>(() => {
        if (hasValue(value)) {
            return value
        } else if (hasValue(defaultValue)) {
            return typeof defaultValue === 'function'
                ? (defaultValue as any)()
                : defaultValue
        } else {
            return typeof defaultStateValue === 'function'
                ? (defaultStateValue as any)()
                : defaultStateValue
        }
    })

    // 以下两个参数的定义，每次渲染都会执行，故而取的都是最新值
    // 合并状态值；优先取受控 value，否则取内部状态
    const mergedValue = value !== undefined ? value : innerValue
    // 经过 postState 处理后的最终返回值
    const postMergedValue = postState ? postState(mergedValue) : mergedValue

    const onChangeFn = useEvent(onChange ?? (() => {}))

    // ============ 保存前一个值，便于触发 onChange ===============
    // 存储上一次状态（用数组包裹是为了引用稳定）
    const [prevValue, setPrevValue] = useSafeState<[T]>([mergedValue])

    // 上一个值变化，触发 onChange
    useLayoutEffect(() => {
        const prev = prevValue[0]
        // 使用 innerValue 作为当前值，而不是 mergedValue，意思是只在非受控模式下内部值变化时触发
        if (innerValue !== prev) {
            onChangeFn(innerValue, prev)
        }
    }, [prevValue])

    // ================== 受控切换回非受控的处理 ==================
    useLayoutEffect(() => {
        if (!hasValue(value)) {
            setInnerValue(value)
        }
    }, [value])

    // ===================== 更新状态的方法 ===================
    const triggerChange: SetState<T> = useEvent((state, ignoreDestroy) => {
        setInnerValue(state, ignoreDestroy)
        setPrevValue([mergedValue], ignoreDestroy)
    })

    return [postMergedValue as unknown as R, triggerChange]
}

export default useMergedState
