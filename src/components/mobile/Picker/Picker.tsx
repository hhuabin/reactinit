/* eslint-disable max-lines */
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import { useInternalLayoutEffect } from '@/hooks/reactHooks/useLayoutUpdateEffect'
import useTouch from './useTouch'
import { isMultiColumn, clamp, getPickerColumnDepth } from './utils'
import './Picker.less'

import type { PickerOption, PickerColumn, PickerConfirmEventParams } from './Picker.d'

type PickerProps = {
    visible?: boolean;                        // 是否显示
    columns?: PickerColumn | PickerColumn[];  // 配置列的选项
    defaultIndex?: number[];                  // 默认选中项
    title?: string;                           // 标题
    cancelText?: string;                      // 取消按钮的文字
    confirmText?: string;                     // 确定按钮的文字
    primaryColor?: string;                    // 主题色
    visibleOptionNum?: number;                // 可见的选项个数
    onChangeVisible?: (value: boolean) => void;                // 显示状态改变时触发函数
    onConfirm?: (params: PickerConfirmEventParams) => void;    // 确认时触发函数
    onCancel?: () => void;                    // 取消时触发函数
}


const DEFAULT_DURATION = 200              // 默认动画时长
const INERTIAL_SLIDE_TIME = 300           // 惯性滚动判定时间，在该时间范围内为惯性滚动
const INERTIAL_SLIDE_DISTANCE = 15        // 惯性滚动判定距离
const INERTIAL_SLIDE_DURATION = 1000      // 惯性滚动动画时长
const COLUMN_HEIGHT = 44                  // 列高

/**
 * Picker 选择器
 * 原理：通过 touch 事件，记录触摸点位移，根据位移计算滚动距离
 *      使用 animation 改变CSS属性 transform: translateY，实现滚动
 *      实时滚动动画时长为0ms，一般滚动动画时长为 200ms，惯性滚动动画时长为 1000ms
 *      动画使用 Web Animation API，相对于 style 动态改变样式性能更好
 * 功能：
 * 1. 惯性滚动，inertialScrolling()
 * 2. 滚动在较近的一项，updateColumnByIndex()
 */
const Picker: React.FC<PickerProps> = (props) => {

    const {
        visible,
        columns,
        defaultIndex = [],
        title = '',
        cancelText = '取消',
        confirmText = '确定',
        primaryColor = '#1989fa',
        visibleOptionNum = 6,
    } = props

    const [mergeVisible, setMergeVisible] = useMergedState(true, {
        value: visible,
        onChange: (value) => {
            props.onChangeVisible?.(value)
        },
    })

    // 第一项居中的基础偏移的距离，也就是列顶部的最低点，之后只会在此基础上向上移动（也就是做减法的transformY）
    const baseOffset = COLUMN_HEIGHT * (+visibleOptionNum - 1) / 2

    const currentMode = useRef<'singlecolumn' | 'multicolumn' | 'cascader'>('singlecolumn')     // 选择器当前的模式
    const [currentColumns, setCurrentColumns] = useState<PickerColumn[]>([])          // 存储各列内容的数组
    const [transformYs, setTransformYs] = useState<number[]>([])                      // 各列滚动的当前偏移量
    const [isInertialScrollings, setIsInertialScrollings] = useState<boolean[]>([])   // 各列是否正在惯性滚动

    const wrapperElementRefs = useRef<(HTMLUListElement | null)[]>([])
    const lastIndexs = useRef<number[]>([])                // 缓存上一次的选中项

    const startOffsets = useRef<number[]>([])              // 滑动开始时的 transformY
    const movings = useRef<boolean[]>([])                  // 滚动判定，正在滚动时点击无效
    const inertialStartTimes = useRef<number[]>([])        // 惯性滚动前置时间，用于惯性滚动判定
    const inertialOffsets = useRef<number[]>([])           // 惯性滚动前置偏移量，用于惯性滚动判定

    const touch = useTouch()

    useInternalLayoutEffect(() => {
        // 处理传入的数组，将传入数组 columns 改为 currentColumns
        if (!Array.isArray(columns) || columns.length === 0) return

        if (isMultiColumn(columns)) {
            // 1. 多列
            currentMode.current = 'multicolumn'
            setCurrentColumns(columns as PickerColumn[])
            initBaseData(columns.length)
        } else {
            // 2. 单列
            const newColumns: PickerColumn[] = [columns]
            currentMode.current = 'singlecolumn'
            // 3. 级联
            let columnIndex = 0
            const columnDepth = getPickerColumnDepth(columns)   // 寻找 children 最大深度
            let current: PickerOption = (columns as PickerColumn)[defaultIndex[columnIndex++] ?? 0] ?? columns[0]
            if (current.children && !!current.children.length) currentMode.current = 'cascader'

            // 向下寻找 children
            while (current.children && !!current.children.length) {
                newColumns.push(current.children)
                current = current.children[defaultIndex[columnIndex++] ?? 0] ?? current.children[0]
            }
            if (newColumns.length < columnDepth) {
                // 小于最大深度，直接赋值空数组，保证 currentColumns 长度一致
                newColumns.push(...Array.from({ length: columnDepth - newColumns.length }, () => []))
            }

            setCurrentColumns(newColumns)
            initBaseData(columnDepth)
        }
    }, [columns])

    useEffect(() => {
        if (currentColumns.length === 0) return

        // 初始化/重置每一列的惯性滚动状态为 false
        setIsInertialScrollings(new Array(currentColumns.length).fill(false))
        // 恢复列选中位置为 lastIndexs 状态
        for (let columnIndex = 0; columnIndex < currentColumns.length; columnIndex++) {
            updateColumnByIndex(columnIndex, lastIndexs.current[columnIndex] ?? 0, 0)
        }
    }, [columns, currentColumns.length])   // 添加 currentColumns.length 依赖是因为初始化 columns 变化时，currentColumns 还是 []

    useEffect(() => {
        // 初始化/重置每一列的惯性滚动状态为 false
        setIsInertialScrollings(new Array(currentColumns.length).fill(false))
        // 恢复列选中位置为 lastIndexs 状态
        for (let columnIndex = 0; columnIndex < currentColumns.length; columnIndex++) {
            updateColumnByIndex(columnIndex, lastIndexs.current[columnIndex] ?? 0, 0)
        }

        // 恢复级联数据为 lastIndexs 状态，此处与处理传入的数组相似
        if (currentMode.current === 'cascader' && Array.isArray(columns)) {
            const newColumns: PickerColumn[] = [columns]
            let columnIndex = 0
            let current: PickerOption | undefined = (columns as PickerColumn)[lastIndexs.current[columnIndex++] ?? 0]
            const columnDepth = getPickerColumnDepth(columns)   // 寻找 children 最大深度

            // 向下寻找 children
            while (current.children && !!current.children.length) {
                newColumns.push(current.children)
                current = current.children[lastIndexs.current[columnIndex++] ?? 0] ?? current.children[0]
            }
            if (newColumns.length < columnDepth) {
                // 小于最大深度，直接赋值空数组，保证 currentColumns 长度一致
                newColumns.push(...Array.from({ length: columnDepth - newColumns.length }, () => []))
            }

            setCurrentColumns(newColumns)
        }

        const origin = document.body.style.overflow
        if (mergeVisible) {
            // 禁止背景滚动
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = origin
        }
    }, [mergeVisible])

    // 根据 columnCount 列数，初始化每一列的数据
    const initBaseData = (columnCount: number = 1) => {
        columnCount = Math.max(1, columnCount)
        // 初始化数据
        setTransformYs(new Array(columnCount).fill(0))
        setIsInertialScrollings(new Array(columnCount).fill(false))
        lastIndexs.current = new Array(columnCount).fill(0).map((_, i) => defaultIndex[i] ?? 0)

        startOffsets.current = new Array(columnCount).fill(0)
        movings.current = new Array(columnCount).fill(false)
        inertialStartTimes.current = new Array(columnCount).fill(0)
        inertialOffsets.current = new Array(columnCount).fill(0)
    }

    /**
     * @description 根据偏移量 offset 获取对应的索引
     * @param offset 当前偏移距离
     * @param columnIndex 仅做下标安全范围限制，在此处无其他作用
     * @returns trustedIndex 下标索引
     */
    const getIndexByOffsetAndColumnIndex = (offset: number, columnIndex: number) => {
        // 根据当前偏移距离，计算索引，但是索引可能会超出边界，所以需要处理一下
        const notTrustedIndex = Math.round((-offset + baseOffset) / COLUMN_HEIGHT)
        // 计算正常范围内的索引
        const trustedIndex = clamp(notTrustedIndex, 0, currentColumns[columnIndex].length - 1)
        return trustedIndex
    }
    /**
     * @description 根据 columnIndex 列的当前偏移量 获取 当前滚动的下标索引
     * @param { number } columnIndex currentColumns 下标索引
     * @returns { number } 下标索引
     */
    const getCurrentIndexByColumnIndex = (columnIndex: number) => getIndexByOffsetAndColumnIndex(transformYs[columnIndex], columnIndex)
    /**
     * @description 根据 offsets 偏移量获取 currentColumns 全部滚动位置的下标索引
     * @returns { number[] } 下标索引列表
     */
    const getCurrentIndexsByTransformYs = (offsets: number[] = transformYs) => offsets.map(getIndexByOffsetAndColumnIndex)

    /**
     *@description 让滚动定格在某一项
     * 根据索引更新偏移量，也是每个更新最后执行的函数
     * @param columnIndex currentColumns 的下标索引
     * @param index currentColumns[columnIndex] 的下标索引
     * @param duration 动画时长
     */
    const updateColumnByIndex = (columnIndex: number, index: number, duration: number) => {
        if (!currentColumns[columnIndex]) return
        const offset = baseOffset - clamp(index, 0, currentColumns[columnIndex].length - 1) * COLUMN_HEIGHT
        /**
         * 这个位置可以增加 onChange 事件，由于用的少，此处不写
         * props.onChange?.()
         */
        updateAnimate(columnIndex, offset, duration)
    }

    /**
     * @description 改变级联数据
     * 点击（onClickOption）、滑动（onTouchEnd）、惯性滚动（inertialScrolling），均需调用
     * @param columnIndex 列下标
     * @param index 列项
     * @param duration 动画时间
     */
    const updateCascaderColumns = (columnIndex: number, index: number, duration: number) => {
        if (currentMode.current !== 'cascader') return
        setCurrentColumns(prevColumns => {
            const newColumns = [...prevColumns]
            let i = columnIndex + 1
            let current: PickerOption = prevColumns[columnIndex][index]

            while (current?.children && current.children.length) {
                // 更新后续级联列为第一项
                updateAnimate(i, baseOffset, duration)
                newColumns[i++] = current.children
                current = current.children[0]
            }
            while (i < prevColumns.length) newColumns[i++] = []
            return newColumns
        })
    }

    /**
     * @description 让 columnIndex 列开始惯性滚动，并且修改级联数据
     * @param distance 滚动的距离
     * @param duration 持续时间
     * @param columnIndex 列下标
     */
    const inertialScrolling = (distance: number, duration: number, columnIndex: number) => {
        const speed = Math.abs(distance / duration)
        // 增加惯性滚动距离
        distance = transformYs[columnIndex] + speed / 3e-3 * (distance < 0 ? -1 : 1)
        const index = getIndexByOffsetAndColumnIndex(distance, columnIndex)
        setIsInertialScrollings(prev => prev.map((isInertialScrolling, index) => index === columnIndex ? true : isInertialScrolling))
        updateColumnByIndex(columnIndex, index, INERTIAL_SLIDE_DURATION)
        updateCascaderColumns(columnIndex, index, INERTIAL_SLIDE_DURATION)
    }
    /**
     * @description 停止 columnIndex 列的惯性滚动
     * @param columnIndex 列下标
     */
    const stopInertialScrolling = (columnIndex: number) => {
        setIsInertialScrollings(prev => prev.map((isInertialScrolling, index) => index === columnIndex ? false : isInertialScrolling))
        movings.current[columnIndex] = false
    }

    /**
     * @description 点击项时触发滚动，并且修改级联数据
     * @param columnIndex 列下标
     * @param index 列项
     */
    const onClickOption = (columnIndex: number, index: number) => {
        if (movings.current[columnIndex]) return

        setIsInertialScrollings(prev => prev.map((isInertialScrolling, index) => index === columnIndex ? false : isInertialScrolling))
        updateColumnByIndex(columnIndex, index, DEFAULT_DURATION)
        updateCascaderColumns(columnIndex, index, DEFAULT_DURATION)
    }

    /**
     * 1. 记录触摸开始时的偏移量，用于惯性滚动判定
     * 2. 当正处于滚动时，暂停滚动，从新计算滚动距离
     */
    const onTouchStart = (event: React.TouchEvent, columnIndex: number) => {
        touch.start(event)
        setIsInertialScrollings(prev => prev.map((isInertialScrolling, index) => index === columnIndex ? false : isInertialScrolling))
        let _transformY = transformYs[columnIndex]
        if (movings.current[columnIndex]) {
            const { transform } = window.getComputedStyle(wrapperElementRefs.current[columnIndex] as HTMLUListElement)
            _transformY = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform).m42
            updateAnimate(columnIndex, _transformY, 0)
        }
        startOffsets.current[columnIndex] = _transformY        // 定义滑动开始前的位置
        inertialOffsets.current[columnIndex] = _transformY     // 记录惯性滚动偏移前位置
        inertialStartTimes.current[columnIndex] = Date.now()   // 记录惯性滚动开始时间
    }
    /**
     * 1. 计算可以滑动的最大距离和最小距离
     * 2. 实时更新动画
     * 3. 重新定义惯性滚动的起始偏移量
     */
    const onTouchMove = (event: React.TouchEvent, columnIndex: number) => {
        touch.move(event)
        event.stopPropagation()     // 停止传播
        if (touch.isVertical()) movings.current[columnIndex] = true
        // 计算可以滑动的最大距离和最小距离
        const maxColumuHeight = currentColumns[columnIndex].length * COLUMN_HEIGHT
        const newOffset = clamp(startOffsets.current[columnIndex] + touch.deltaY.current, -maxColumuHeight + baseOffset, baseOffset + COLUMN_HEIGHT)
        updateAnimate(columnIndex, newOffset, 0)
        const now = Date.now()
        // 超过触发惯性滚动的时间，重新定义惯性滚动的偏移量
        if (now - inertialStartTimes.current[columnIndex] > INERTIAL_SLIDE_TIME) {
            inertialStartTimes.current[columnIndex] = now
            inertialOffsets.current[columnIndex] = newOffset
        }
    }
    /**
     * 1. 惯性滚动判定
     * 2. 定格在某一项
     * 亲测：点击时候也会触发
     */
    const onTouchEnd = (event: React.TouchEvent, columnIndex: number) => {
        // 判定是否属于惯性滚动
        const distance = transformYs[columnIndex] - inertialOffsets.current[columnIndex]
        const duration = Date.now() - inertialStartTimes.current[columnIndex]
        if (Math.abs(distance) > INERTIAL_SLIDE_DISTANCE && duration < INERTIAL_SLIDE_TIME) {
            // 惯性滚动
            inertialScrolling(distance, duration, columnIndex)
            return
        }
        // 非惯性滚动需要定格在某一项
        const index = getIndexByOffsetAndColumnIndex(transformYs[columnIndex], columnIndex)
        updateColumnByIndex(columnIndex, index, DEFAULT_DURATION)
        updateCascaderColumns(columnIndex, index, DEFAULT_DURATION)
        setTimeout(() => {
            movings.current[columnIndex] = false
        }, 0)
    }

    /**
     * @description 更新动画
     * @param columnIndex 需要更新的列下标
     * @param endTransformY 动画结束的偏移量
     * @param transitionDuration 动画时间， 默认值为 0
     */
    const updateAnimate = (columnIndex: number, endTransformY: number, transitionDuration = 0) => {
        if (endTransformY === transformYs[columnIndex]) return
        // 记录当前偏移量
        setTransformYs(prev => prev.map((transformY, index) => index === columnIndex ? endTransformY : transformY))
        // 获取动画当前的偏移量
        const { transform } = window.getComputedStyle(wrapperElementRefs.current[columnIndex] as HTMLUListElement)
        const currentTransformY = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform).m42
        const keyframes: Keyframe[] = [
            { transform: `translateY(${currentTransformY}px)` },
            { transform: `translateY(${endTransformY}px)` },
        ]
        const options: KeyframeAnimationOptions = {
            duration: transitionDuration,
            fill: 'forwards',
            easing: 'cubic-bezier(.23, 1, .68, 1)',
        }
        // 取消之前的动画
        wrapperElementRefs.current[columnIndex]?.getAnimations().forEach(animation => animation.cancel())
        const animation = wrapperElementRefs.current[columnIndex]?.animate(keyframes, options)
        if (transitionDuration === INERTIAL_SLIDE_DURATION) {
            animation?.finished.then(() => {
                // 惯性滚动结束触发
                stopInertialScrolling(columnIndex)
            }, () => { })
        }
    }

    const onClickMask = () => {
        onCancel()
    }

    const onCancel = () => {
        setMergeVisible(false)
        props.onCancel?.()
    }

    const onConfirm = () => {
        const selectedIndexs = getCurrentIndexsByTransformYs()
        const selectedOptions = currentColumns.map((options, index) => options[selectedIndexs[index]] || { label: '', value: '' })
        const selectedValues = selectedOptions.map(option => option?.label || '')
        lastIndexs.current = selectedIndexs

        setMergeVisible(false)
        props.onConfirm?.({ selectedIndexs, selectedOptions, selectedValues })
    }

    return createPortal(
        <>
            <div
                className={'bin-picker-popup' + (mergeVisible ? '' : ' bin-picker-popup-hidden')}
                style={{ '--primary-color': primaryColor } as React.CSSProperties}
            >
                <div role='button' className={'bin-overlay' + (mergeVisible ? '' : ' bin-overlay-hidden')}
                    onClick={() => onClickMask()}
                ></div>

                <div className={'bin-popup-body' + (mergeVisible ? '' : ' bin-popup-hidden')}>
                    <div className='bin-picker-header'>
                        <button
                            type='button'
                            className='bin-picker-header-cancel-button'
                            onClick={() => onCancel()}
                        >
                            {cancelText || '取消'}
                        </button>
                        <div className='bin-picker-header-title'>{title || ''}</div>
                        <button
                            type='button'
                            className='bin-picker-header-confirm-button'
                            onClick={() => onConfirm()}
                        >
                            {confirmText || '确定'}
                        </button>
                    </div>
                    <div
                        className='bin-picker-body'
                        style={{ height: (+visibleOptionNum * COLUMN_HEIGHT) + 'px' }}
                    >
                        <div className='bin-picker-columns'>
                            {currentColumns.map((column, columnIndex) => (
                                <div
                                    className='bin-picker-column'
                                    key={columnIndex}
                                    onTouchStart={e => onTouchStart(e, columnIndex)}
                                    onTouchMove={e => onTouchMove(e, columnIndex)}
                                    onTouchEnd={e => onTouchEnd(e, columnIndex)}
                                >
                                    <ul
                                        ref={node => wrapperElementRefs.current[columnIndex] = node}
                                        className='bin-picker-column-wrapper'
                                    >
                                        {column.map((item, index) => (
                                            <li
                                                role='button'
                                                tabIndex={index}
                                                className='bin-picker-column-item'
                                                key={index}
                                                onClick={() => onClickOption(columnIndex, index)}
                                                style={{ color: ((index == getCurrentIndexByColumnIndex(columnIndex) && !isInertialScrollings[columnIndex]) ? 'var(--primary-color)' : '') }}
                                            >
                                                <div className='bin-line-ellipsis'>
                                                    {item.label}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div
                            className='bin-picker-mask'
                            style={{ backgroundSize: '100% ' + ((+visibleOptionNum - 1) * COLUMN_HEIGHT / 2) + 'px' }}
                        ></div>
                        <div className='bin-picker-frame'></div>
                    </div>
                </div>
            </div>
        </>,
        document.body,
    )
}

export default Picker
