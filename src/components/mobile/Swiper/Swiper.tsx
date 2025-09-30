/**
 * @Author: bin
 * @Date: 2025-09-16 14:40:22
 * @LastEditors: bin
 * @LastEditTime: 2025-09-30 16:39:09
 */
/* eslint-disable max-lines */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { useInternalLayoutEffect } from '@/hooks/reactHooks/useLayoutUpdateEffect'
import type { ForwardedRef } from 'react'

import SwiperItem from './SwiperItem'
import type { SwiperItemProps } from './SwiperItem'
import useTouch from './useTouch'
import './Swiper.less'
import { off } from 'process'

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

    const [trackState, setTrackState] = useState({             // 滚动块(trackRef)的状态
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
        startAutoplay()
        // TODO 解决多次执行的问题
        return () => {
            if (autoplayTimer.current) clearTimeout(autoplayTimer.current)
        }
    }, [autoplay, autoplayInterval])

    /**
     * @description 让滚动定格在某一项
     * @param index 项下标
     * @param duration 动画时长
     */
    const updateAnimateByIndex = (index: number, duration = 0) => {
        console.log('updateAnimateByIndex', index);

        // 控制索引不超出范围
        if (loop) {
            index = clamp(index, -1, swiperItemCount)
        } else {
            index = clamp(index, 0, swiperItemCount - 1)
        }

        // 计算移动距离
        let trustedOffset = 0
        if (direction === 'horizontal') {
            trustedOffset = -index * trackState.width
        } else if (direction === 'vertical') {
            trustedOffset = -index * trackState.height
        }

        // 触发动画
        updateAnimate(trustedOffset, duration)

        setTrackState(prevState => ({
            ...prevState,
            active: (index + swiperItemCount) % swiperItemCount,
        }))
    }

    // 根据 offset 获取更靠近的下标
    const getNearIndexByOffset = (offset = trackState.offset): number => {
        // TODO 屏蔽 nearIndex 是 NaN 的情况
        // 向左 / 向上滑动时，offset 是负数
        offset = -offset
        let nearIndex: number = 0
        if (direction === 'horizontal') {
            nearIndex = Math.round(offset / trackState.width)
        } else if (direction === 'vertical') {
            nearIndex = Math.round(offset / trackState.height)
        }
        console.log('getNearIndexByOffset nearIndex', nearIndex);

        if (loop) {
            nearIndex = clamp(nearIndex, -1, swiperItemCount)
        } else {
            nearIndex = clamp(nearIndex, 0, swiperItemCount - 1)
        }
        console.log('getNearIndexByOffset', offset, nearIndex);
        return nearIndex
    }

    const prev = () => {
        const nearIndex = getNearIndexByOffset()
        console.log('prev', nearIndex);
        updateAnimateByIndex(nearIndex, duration)
    }
    const next = () => {
        const nearIndex = getNearIndexByOffset()
        console.log('next', nearIndex);
        updateAnimateByIndex(nearIndex, duration)
    }
    const swipeTo = (index: number, swiperDuration = duration) => {
        updateAnimateByIndex(index, swiperDuration)
    }

    const stopAutoplay = () => clearTimeout(autoplayTimer.current)

    const startAutoplay = () => {
        stopAutoplay()
        if (swiperItemCount > 1) {
            autoplayTimer.current = setTimeout(() => {
                next()
                clearTimeout(autoplayTimer.current)
                startAutoplay()
            }, autoplayInterval)
        }
    }

    const onTouchStart = (event: React.TouchEvent) => {
        if (!touchable) return
        stopAutoplay()
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
        startOffset.current = trackState.offset
        inertialOffset.current = trackState.offset
        inertialStartTime.current = Date.now()
    }
    const onTouchMove = (event: React.TouchEvent) => {
        if (!touchable) return
        touch.move(event)
        if (stopPropagation) event.stopPropagation()

        // let newOffset = startOffset.current + touch.deltaX.current
        let newOffset = startOffset.current
        if (direction === 'horizontal' && touch.isHorizontal()) {
            moving.current = true
            if (loop) {
                // TODO 开启循环的时候，整除
            } else {
                // 未开启循环要做边界处理
                if (newOffset + touch.deltaX.current < -(swiperItemCount - 1) * trackState.width) {
                    newOffset += touch.deltaX.current / 5
                } else if (newOffset + touch.deltaX.current > 0) {
                    newOffset += touch.deltaX.current / 5
                } else {
                    newOffset += touch.deltaX.current
                }
                newOffset = clamp(newOffset, (-(swiperItemCount - 0.5) * trackState.width), trackState.width / 2)
            }
        } else if (direction === 'vertical' && touch.isVertical()) {
            moving.current = true
            if (loop) {
                // TODO 开启循环的时候，整除
            } else {
                // 未开启循环要做边界处理
                if (newOffset + touch.deltaY.current < -(swiperItemCount - 1) * trackState.height) {
                    newOffset += touch.deltaY.current / 5
                } else if (newOffset + touch.deltaY.current > 0) {
                    newOffset += touch.deltaY.current / 5
                } else {
                    newOffset += touch.deltaY.current
                }
                newOffset = clamp(newOffset, (-(swiperItemCount - 0.5) * trackState.height), trackState.height / 2)
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
        // 判定是否属于惯性滚动
        const distance = trackState.offset - inertialOffset.current
        const duration = Date.now() - inertialStartTime.current
        if (Math.abs(distance) > INERTIAL_SLIDE_DISTANCE && duration < INERTIAL_SLIDE_TIME) {
            if (direction === 'horizontal') {
                console.log('touch.deltaX.current', touch.deltaX.current);
                
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
        const index = getNearIndexByOffset(trackState.offset)
        updateAnimateByIndex(index, duration)

        setTimeout(() => {
            moving.current = false
        }, 0)
    }

    /**
     * @description 更新动画
     * @param endTransformX 动画结束的偏移量
     * @param transitionDuration 动画时长， 默认值为 0
     */
    const updateAnimate = (transformValue: number, transitionDuration = 0) => {
        if (Number.isNaN(transformValue)) transformValue = 0
        if (transformValue === trackState.offset) return
        setTrackState(prevState => ({
            ...prevState,
            offset: transformValue,
        }))
        // 获取动画当前的偏移量
        const { transform } = window.getComputedStyle(trackRef.current as HTMLDivElement)
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

        trackRef.current?.getAnimations().forEach(animation => animation.cancel())
        const animation = trackRef.current?.animate(keyframes, options)
        animation?.finished.then(() => {
            // 动画结束触发
            console.log('动画结束');
        }, () => {})
    }

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
            /* if (loop && swiperItemCount >= 2 && (i === 0 || i === swiperItemCount - 1)) {
                let translateX = 0
                let translateY = 0
                if (direction === 'horizontal') {

                } else if (direction === 'vertical') {

                }

                style.transform = `transform: translate3d(${translateX}, ${translateY}, 0)`
            } */

            return React.cloneElement(child as React.ReactElement<SwiperItemProps>, style)
        })
    }

    /**
     * @description 渲染指示器
     * @param count 轮播数量
     * @param activeIndex 活动索引
     * @returns { React.ReactNode } Node 元素
     */
    const renderIndicators = (count = swiperItemCount, activeIndex: number = trackState.active): React.ReactNode => {
        // 只有一张就不用显示指示器了
        if (!showIndicator || count === 1) return null

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
