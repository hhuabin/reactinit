/* eslint-disable max-lines */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { flushSync } from 'react-dom'
import { useInternalLayoutEffect } from '@/hooks/reactHooks/useLayoutUpdateEffect'
import type { ForwardedRef } from 'react'

import useSyncState from '@/hooks/reactHooks/useSyncState'
import SwiperItem from './SwiperItem'
import type { SwiperItemProps } from './SwiperItem'
import useTouch from './useTouch'
import './Swiper.less'

type SwiperProps = {
    autoplay?: boolean;                     // 是否自动切换，默认为 false
    duration?: number;                      // 切换动画时长，单位为 ms，默认为 500
    autoplayInterval?: number;              // 自动切换的间隔，单位为 ms，默认为 3000
    defaultIndex?: number;                  // 默认位置索引值，必须限制在 [0, SwiperItem.length - 1]
    width?: number | string;                // 滑块宽度，默认值 100%，若是 number 类型，则单位是 px
    height?: number | string;               // 滑块高度，默认值 100%，若是 number 类型，则单位是 px
    loop?: boolean;                         // 是否循环播放，默认值 true
    showIndicator?: boolean;                // 是否显示指示器，默认为 true
    indicatorColor?: string;                // 指示器颜色，默认为 #1989fa
    direction?: 'horizontal' | 'vertical';  // 滚动方向，默认为 'horizontal'
    touchable?: boolean;                    // 是否可以通过手势滑动，默认为 true
    stopPropagation?: boolean;              // 是否阻止滑动事件冒泡，默认为 true
    style?: React.CSSProperties;            // 自定义样式
    children?: React.ReactElement<typeof SwiperItem> | React.ReactElement<typeof SwiperItem>[];       // 轮播内容，SwiperItem
    onChange?: (index: number) => void;     // 切换时触发
}
export type SwiperRef = {
    prev: () => void;
    next: () => void;
    swipeTo: (index: number) => void;
}

const DEFAULT_DURATION = 500                // 默认动画时长
const INERTIAL_SLIDE_TIME = 300             // 惯性滚动判定时间，在该时间范围内为惯性滚动
const INERTIAL_SLIDE_DISTANCE = 15          // 惯性滚动判定距离

// 获取中间的数字
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const Swiper = forwardRef(function Swiper(props: SwiperProps, ref: ForwardedRef<SwiperRef>) {

    const {
        autoplay = false,
        duration = DEFAULT_DURATION,
        autoplayInterval = 3000,
        defaultIndex = 0,
        width = '',
        height = '',
        loop = false,
        showIndicator = true,
        indicatorColor = '',
        direction = 'horizontal',
        touchable = true,
        stopPropagation = true,
        style = {},
        children,
        onChange,
    } = props

    const rootRef = useRef<HTMLDivElement | null>(null)        // 最外层元素，框框
    const trackRef = useRef<HTMLDivElement | null>(null)       // 滚动块
    const [rootStyle, setRootStyle] = useState({               // 存放最外层 swiper(rootRef) 的样式
        width: 0,
        height: 0,
    })

    const autoplayTimer = useRef<ReturnType<typeof setTimeout>>()      // 自动滚动的定时器
    const startOffset = useRef(0)                              // 滑动开始时的 transformY
    const moving = useRef(false)                               // 滚动判定，正在滚动时点击无效
    const inertialStartTime = useRef(0)                        // 惯性滚动前置时间，用于惯性滚动判定
    const inertialOffset = useRef(0)                           // 惯性滚动前置偏移量，用于惯性滚动判定

    // trackState 会被闭包取值，故使用 useSyncState
    const [stableTrackState, setTrackState] = useSyncState({             // 滚动块(trackRef)的状态
        width: 0,                    // 单个 item 宽
        height: 0,                   // 单个 item 高
        offset: 0,                   // track 当前的偏移量
        active: defaultIndex,        // 当前激活的索引
        moving: false,               // 滚动判定，正在滚动时点击无效
    })

    // 获取子元素个数
    const swiperItemCount = React.Children.count(children)

    const touch = useTouch()

    /***************************
     * 窗口改变，获取 swiper 的大小
     ***************************/
    useEffect(() => {
        window.addEventListener('resize', () => {
            getRootRefDOMSize()
        }, { passive: true })
    }, [])
    // 监听宽度、高度，获取 swiper 的大小
    useInternalLayoutEffect(() => {
        getRootRefDOMSize()
    }, [width, height])
    /**
     * @description 获取 swiper 的大小
     * 不管参数 / 窗口是否发生变化，都能获取到正确的大小
     */
    const getRootRefDOMSize = () => {
        if (!rootRef.current) return

        // 确保取到正确的 offsetWidth 值
        requestAnimationFrame(() => {
            const { offsetWidth, offsetHeight } = rootRef.current!
            setRootStyle({
                width: offsetWidth,
                height: offsetHeight,
            })
            setTrackState(prevState => ({
                ...prevState,
                width: offsetWidth,
                height: offsetHeight,
            }))
        })
    }

    /************************
     * 自动播放
     ************************/
    useEffect(() => {
        startAutoPlay()

        return () => {
            if (autoplayTimer.current) clearTimeout(autoplayTimer.current)
        }
    }, [autoplay, autoplayInterval])

    // 根据 offset 获取更靠近的下标
    const getNearIndexByOffset = (offset = stableTrackState().offset): number => {
        // 向左 / 向上滑动时，offset 是负数
        offset = -offset

        let nearIndex: number = 0
        if (direction === 'horizontal') {
            nearIndex = Math.round(offset / stableTrackState().width)
        } else if (direction === 'vertical') {
            nearIndex = Math.round(offset / stableTrackState().height)
        }
        if (Number.isNaN(nearIndex)) nearIndex = 0

        if (loop) {
            nearIndex = clamp(nearIndex, -1, swiperItemCount)
        } else {
            nearIndex = clamp(nearIndex, 0, swiperItemCount - 1)
        }

        return nearIndex
    }

    const prev = () => {
        // const nearIndex = getNearIndexByOffset()
        const activeIndex = stableTrackState().active
        let targetIndex = activeIndex - 1

        if (loop) {
            // 循环时可以超出 [0, swiperItemCount - 1]，超出情况 updateAnimateByIndex 和 updateAnimate 会自动处理，这里无需关注
            targetIndex = clamp(targetIndex, -1, swiperItemCount)
        } else {
            targetIndex = clamp(targetIndex, 0, swiperItemCount - 1)
        }

        updateAnimateByIndex(targetIndex, duration)
    }
    const next = () => {
        const activeIndex = stableTrackState().active
        let targetIndex = activeIndex + 1

        if (loop) {
            // 循环时可以超出 [0, swiperItemCount - 1]，超出情况 updateAnimateByIndex 和 updateAnimate 会自动处理，这里无需关注
            targetIndex = clamp(targetIndex, -1, swiperItemCount)
        } else {
            targetIndex = clamp(targetIndex, 0, swiperItemCount - 1)
        }

        updateAnimateByIndex(targetIndex, duration)
    }
    const swipeTo = (index: number, swiperDuration = duration) => {
        updateAnimateByIndex(index, swiperDuration)
    }

    const stopAutoPlay = () => clearTimeout(autoplayTimer.current)

    const startAutoPlay = () => {
        if (!autoplay || swiperItemCount === 1) return
        stopAutoPlay()
        if (swiperItemCount > 1) {
            autoplayTimer.current = setTimeout(() => {
                next()
                startAutoPlay()
            }, autoplayInterval)
        }
    }

    const onTouchStart = (event: React.TouchEvent) => {
        if (!touchable) return
        stopAutoPlay()
        touch.start(event)
        // 正在滚动时点击无效
        if (moving.current) {
            const { transform } = window.getComputedStyle(trackRef.current as HTMLDivElement)
            const { m41, m42 } = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform)
            if (direction === 'horizontal') {
                // 设置横向偏移量
                updateAnimate(m41, 0)
            } else {
                // 设置纵向偏移量
                updateAnimate(m42, 0)
            }
        }
        startOffset.current = stableTrackState().offset
        inertialOffset.current = stableTrackState().offset
        inertialStartTime.current = Date.now()
    }
    /* const getLoopTranslateX = (offset: number): number => {
        const boxWidth = stableTrackState().width
        const min = -boxWidth * (swiperItemCount)
        const max = boxWidth
        const range = max - min

        // 使用数学模，保证 x 无论多大多小都能映射到 [min, max)
        const safeOffset = ((offset - min) % range + range) % range + min
        console.log('safeOffset', safeOffset, range);

        return safeOffset
    } */
    const onTouchMove = (event: React.TouchEvent) => {
        if (!touchable) return
        touch.move(event)
        if (stopPropagation) event.stopPropagation()

        // let newOffset = startOffset.current + touch.deltaX.current
        let newOffset = startOffset.current
        if (direction === 'horizontal' && touch.isHorizontal()) {
            moving.current = true
            if (loop) {
                // 不搞那么花里胡哨了，直接限制 touch.deltaX.current 的取值范围即可
                newOffset += clamp(touch.deltaX.current, -stableTrackState().width * 0.8, stableTrackState().width * 0.8)
            } else {
                // 未开启循环要做边界处理
                if (newOffset + touch.deltaX.current < -(swiperItemCount - 1) * stableTrackState().width) {
                    newOffset += touch.deltaX.current / 5
                } else if (newOffset + touch.deltaX.current > 0) {
                    newOffset += touch.deltaX.current / 5
                } else {
                    newOffset += touch.deltaX.current
                }
                // 边界限制
                newOffset = clamp(newOffset, (-(swiperItemCount - 0.5) * stableTrackState().width), stableTrackState().width / 2)
            }
        } else if (direction === 'vertical' && touch.isVertical()) {
            moving.current = true
            if (loop) {
                newOffset += clamp(touch.deltaY.current, -stableTrackState().height * 0.8, stableTrackState().height * 0.8)
            } else {
                // 未开启循环要做边界处理
                if (newOffset + touch.deltaY.current < -(swiperItemCount - 1) * stableTrackState().height) {
                    newOffset += touch.deltaY.current / 5
                } else if (newOffset + touch.deltaY.current > 0) {
                    newOffset += touch.deltaY.current / 5
                } else {
                    newOffset += touch.deltaY.current
                }
                newOffset = clamp(newOffset, (-(swiperItemCount - 0.5) * stableTrackState().height), stableTrackState().height / 2)
            }
        }

        updateAnimate(newOffset, 0)

        // 重置惯性滚动判定
        const now = Date.now()
        if (now - inertialStartTime.current > INERTIAL_SLIDE_TIME) {
            inertialOffset.current = newOffset
            inertialStartTime.current = Date.now()
        }
    }
    const onTouchEnd = (event: React.TouchEvent) => {
        if (!touchable) return
        startAutoPlay()
        // 判定是否属于惯性滚动
        const distance = stableTrackState().offset - inertialOffset.current
        const duration = Date.now() - inertialStartTime.current
        if (Math.abs(distance) > INERTIAL_SLIDE_DISTANCE && duration < INERTIAL_SLIDE_TIME) {
            if (direction === 'horizontal') {
                // 滚动块的偏移量小于 0，则向左滚动
                if (touch.deltaX.current > 0) prev()
                // 滚动块的偏移量大于 0，则向右滚动
                else if (touch.deltaX.current < 0) next()
            } else {
                if (touch.deltaY.current > 0) prev()
                else if (touch.deltaY.current < 0) next()
            }
            return
        }
        // 非惯性滚动需要定格在某一项
        const index = getNearIndexByOffset(stableTrackState().offset)
        updateAnimateByIndex(index, duration)

        setTimeout(() => {
            moving.current = false
        }, 0)
    }

    /**
     * @description 让滚动定格在某一项，里面会处理纵向/横向滚动，调用仅需关注下标即可
     * @param index 项下标
     * @param duration 动画时长
     */
    const updateAnimateByIndex = (index: number, duration = 0) => {
        if (Number.isNaN(index)) index = 0

        // 控制索引不超出范围
        if (loop) {
            index = clamp(index, -1, swiperItemCount)
        } else {
            index = clamp(index, 0, swiperItemCount - 1)
        }

        // 计算移动距离
        let trustedOffset = 0
        if (direction === 'horizontal') {
            trustedOffset = -index * stableTrackState().width
        } else if (direction === 'vertical') {
            trustedOffset = -index * stableTrackState().height
        }

        const active = index < 0 ? swiperItemCount - 1 : index > swiperItemCount - 1 ? 0 : index

        // TODO: 考虑虚拟滚动时，下标超出，导致指示器显示错误
        setTrackState(prevState => ({
            ...prevState,
            active,
        }))

        // 触发动画
        updateAnimate(trustedOffset, duration)
        onChange?.(active)
    }

    /**
     * @description 更新动画
     * 触发时机：1. updateAnimateByIndex；2. onTouchStart；3. onTouchMove
     * @param endTransformX 动画结束的偏移量
     * @param transitionDuration 动画时长， 默认值为 0
     */
    const updateAnimate = (transformValue: number, transitionDuration = 0) => {
        if (Number.isNaN(transformValue)) transformValue = 0
        // if (transformValue === stableTrackState().offset) return
        flushSync(() => {
            setTrackState(prevState => ({
                ...prevState,
                offset: transformValue,
            }))
        })

        if (!trackRef.current) return
        // 获取动画当前的偏移量
        const { transform } = window.getComputedStyle(trackRef.current)
        const { m41, m42 } = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform)
        let keyframes: Keyframe[]
        if (direction === 'horizontal') {
            keyframes = [
                { transform: `translate3d(${m41}px, 0, 0)` },
                { transform: `translate3d(${transformValue}px, 0, 0)` },
            ]
        } else {
            keyframes = [
                { transform: `translate3d(0, ${m42}px, 0)` },
                { transform: `translate3d(0, ${transformValue}px, 0)` },
            ]
        }
        const options: KeyframeAnimationOptions = {
            duration: transitionDuration,
            fill: 'forwards',
            easing: 'cubic-bezier(.23, 1, .68, 1)',
        }

        trackRef.current.getAnimations().forEach(animation => animation.cancel())
        const animation = trackRef.current?.animate(keyframes, options)
        animation?.finished.then(() => {
            // 循环时，首尾无感切换。动画结束触发
            if (loop) {
                if (direction === 'horizontal') {
                    if (stableTrackState().active === 0 &&  stableTrackState().offset < -stableTrackState().width * (swiperItemCount - 1)) {
                        updateAnimateByIndex(0)
                    } else if (stableTrackState().active === swiperItemCount - 1 && stableTrackState().offset > 0) {
                        updateAnimateByIndex(swiperItemCount - 1)
                    }
                } else if (direction === 'vertical') {
                    if (stableTrackState().active === 0 && stableTrackState().offset < -stableTrackState().height * (swiperItemCount - 1)) {
                        updateAnimateByIndex(0)
                    } else if (stableTrackState().active === swiperItemCount - 1 && stableTrackState().offset > 0) {
                        updateAnimateByIndex(swiperItemCount - 1)
                    }
                }
            }
        }, () => {})
    }
    /* const updateAnimate = (transformValue: number, transitionDuration = 0) => {
        if (Number.isNaN(transformValue)) transformValue = 0

        setTrackState(prevState => ({
            ...prevState,
            offset: transformValue,
        }))

        if (!trackRef.current) return
        // 设置过渡
        if (transitionDuration > 0) {
            trackRef.current.style.transition = `transform ${transitionDuration}ms cubic-bezier(.23, 1, .68, 1)`
        } else {
            trackRef.current.style.transition = 'none'
        }

        // 执行 transform
        if (direction === 'horizontal') {
            trackRef.current.style.transform = `translate3d(${transformValue}px, 0, 0)`
        } else {
            trackRef.current.style.transform = `translate3d(0, ${transformValue}px, 0)`
        }

        if (loop && transitionDuration > 0) {
            console.log('stableTrackState().active', stableTrackState().active);
            if (stableTrackState().active >= swiperItemCount) {
                const handleTransitionEnd = () => {
                    trackRef.current?.removeEventListener('transitionend', handleTransitionEnd)
                    updateAnimateByIndex(0)
                }
                trackRef.current.addEventListener('transitionend', handleTransitionEnd)
            } else if (stableTrackState().active <= -1) {
                const handleTransitionEnd = () => {
                    trackRef.current?.removeEventListener('transitionend', handleTransitionEnd)
                    updateAnimateByIndex(swiperItemCount - 1)
                }
                trackRef.current.addEventListener('transitionend', handleTransitionEnd)
            }
        }
    } */

    useImperativeHandle(ref, () => ({
        prev,
        next,
        swipeTo,
    }))

    /**
     * @description 获取 trackRef 的宽度
     * @returns trackRef 的宽度，单位px
     */
    const getTrackRefSize = (): React.CSSProperties => {
        const trackSize: React.CSSProperties = {}
        if (direction === 'horizontal') {
            trackSize.width = Math.max(swiperItemCount, 1) * rootStyle.width + 'px'
        } else if (direction === 'vertical') {
            trackSize.height = Math.max(swiperItemCount, 1) * rootStyle.height + 'px'
        }
        return trackSize
    }

    /**
     * @description 渲染 SwiperItem
     * @returns 渲染的SwiperItem
     */
    const renderSwiperItems = () => {
        const publcStyle: SwiperItemProps = direction === 'horizontal' ? { width: rootStyle.width } : { height: rootStyle.height }
        return React.Children.map((children || []), (child, i) => {
            const style = { ...publcStyle }
            // 只有开启了循环并且 是头项或者尾项时，才需要设置偏移量
            if (loop && swiperItemCount >= 2) {
                let translateX = 0
                let translateY = 0
                if (direction === 'horizontal') {
                    if (i === swiperItemCount - 1 && stableTrackState().offset > 0) {
                        translateX = -stableTrackState().width * (swiperItemCount)
                    } else if (i === 0 && stableTrackState().offset < -(swiperItemCount - 1) * stableTrackState().width) {
                        translateX = stableTrackState().width * (swiperItemCount)
                    }
                } else if (direction === 'vertical') {
                    if (i === swiperItemCount - 1 && stableTrackState().offset > 0) {
                        translateY = -stableTrackState().height * (swiperItemCount)
                    } else if (i === 0 && stableTrackState().offset < -(swiperItemCount - 1) * stableTrackState().height) {
                        translateY = stableTrackState().height * (swiperItemCount)
                    }
                }

                style.transition = 'none'
                style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`
            }

            return React.cloneElement(child as React.ReactElement<SwiperItemProps>, style)
        })
    }

    /**
     * @description 渲染指示器
     * @param count 轮播数量
     * @param activeIndex 活动索引
     * @returns { React.ReactNode } Node 元素
     */
    const renderIndicators = (count = swiperItemCount, activeIndex: number = stableTrackState().active): React.ReactNode => {
        // 只有一张就不用显示指示器了
        if (!showIndicator || count === 1) return null
        activeIndex = clamp(activeIndex, 0 , count - 1)

        return (
            <div className='bin-swiper-indicators'>
                {Array.from({ length: count }).map((_, i) => (
                    <i
                        className={'bin-swiper-indicator' + (i === activeIndex ? ' bin-swiper-indicator-active' : '')}
                        style={{ backgroundColor: i === activeIndex ? indicatorColor : '' }}
                        key={i}
                    ></i>
                ))}
            </div>
        )
    }

    return (
        <div
            ref={rootRef}
            className='bin-swiper'
            style={{ ...style, width: width || style['width'], height: height || style['height'] }}
        >
            <div
                ref={trackRef}
                className={'bin-swiper-track' + (direction === 'horizontal' ? ' forbid-scroll-x' : ' swiper-vertical forbid-scroll-y')}
                style={ getTrackRefSize() }
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                { renderSwiperItems() }
            </div>

            { renderIndicators() }
        </div>
    )
})

// 添加子组件
type SwiperComponent = typeof Swiper & {
    SwiperItem: typeof SwiperItem
}

const ExportedSwiper = Swiper as SwiperComponent
ExportedSwiper.SwiperItem = SwiperItem

export default ExportedSwiper
