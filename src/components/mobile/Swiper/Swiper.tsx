import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { useInternalLayoutEffect } from '@/hooks/reactHooks/useLayoutUpdateEffect'
import type { ForwardedRef } from 'react'

import SwiperItem from './SwiperItem'
import type { SwiperItemProps } from './SwiperItem'
import useTouch from './useTouch'
import './Swiper.less'

type SwiperProps = {
    autoplay?: boolean;                     // 是否自动切换，默认为 false
    duration?: number;                      // 自动切换的间隔，单位为 ms，默认为 3000
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

const Swiper = forwardRef(function Swiper(props: SwiperProps, ref: ForwardedRef<SwiperRef>) {

    const {
        duration = 3000,
        defaultIndex = 0,
        width = '',
        height = '',
        loop = true,
        showIndicator = true,
        indicatorColor = '',
        direction = 'horizontal',
        touchable = true,
        stopPropagation = true,
        style = {},
        children,
        onChange,
    } = props

    const rootRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const [rootStyle, setRootStyle] = useState({           // 存放最外层 swiper 的样式
        width: 0,
        height: 0,
    })

    const autoplayTimer = useRef<ReturnType<typeof setTimeout>>()      // 自动滚动的定时器
    const currentIndex = useRef(defaultIndex)              // 当前选中的索引下标

    const startOffset = useRef<number[]>([])               // 滑动开始时的 transformY
    const moving = useRef<boolean[]>([])                   // 滚动判定，正在滚动时点击无效
    const inertialStartTime = useRef<number[]>([])         // 惯性滚动前置时间，用于惯性滚动判定
    const inertialOffset = useRef<number[]>([])            // 惯性滚动前置偏移量，用于惯性滚动判定

    // 获取子元素个数
    const swiperItemCount = React.Children.count(children)

    const touch = useTouch()

    // 窗口改变，获取 swiper 的大小
    useEffect(() => {
        window.addEventListener('resize', () => {
            getRootRefDOMSize()
        }, { passive: true })
    }, [])

    useInternalLayoutEffect(() => {
        getRootRefDOMSize()
    }, [width, height])

    const getRootRefDOMSize = () => {
        if (!rootRef.current) return

        // 确保取到正确的 offsetWidth 值
        requestAnimationFrame(() => {
            const { offsetWidth, offsetHeight } = rootRef.current!
            setRootStyle({
                width: offsetWidth,
                height: offsetHeight,
            })
        })
    }

    const getOffset = () => {

    }

    const prev = () => {

    }
    const next = () => {

    }
    const swipeTo = (index: number) => {
    }

    const stopAutoplay = () => clearTimeout(autoplayTimer.current)

    const autoplay = () => {
        stopAutoplay()
        if (swiperItemCount > 1) {
            autoplayTimer.current = setTimeout(() => {
                next()
                autoplay()
            }, duration)
        }
    }

    const onTouchStart = (event: React.TouchEvent) => {
        touch.start(event)
    }
    const onTouchMove = (event: React.TouchEvent) => {
        touch.move(event)
        if (stopPropagation) event.stopPropagation()
    }
    const onTouchEnd = (event: React.TouchEvent) => {

    }

    /**
     * @description 更新动画
     * @param endTransformX 动画结束的偏移量
     * @param transitionDuration 动画时长， 默认值为 0
     */
    const updateAnimate = (transformValue: number, transitionDuration = 0) => {
        // 获取动画当前的偏移量
        const { transform } = window.getComputedStyle(trackRef.current as HTMLDivElement)
        const currentTransformX = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform).m42

        const keyframes: Keyframe[] = [
            { transform: `translateX(${currentTransformX}px)` },
            { transform: `translateX(${transformValue}px)` },
        ]
        const options: KeyframeAnimationOptions = {
            duration: transitionDuration,
            fill: 'forwards',
            easing: 'cubic-bezier(.23, 1, .68, 1)',
        }

        trackRef.current?.getAnimations().forEach(animation => animation.cancel())
        const animation = trackRef.current?.animate(keyframes, options)
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
    const getTrackRefWidth = (): string => {
        let count = swiperItemCount
        if (loop) {
            count = count === 0 ? 1 : count + 2
        }
        count = Math.max(count, 1)
        return  count * rootStyle.width + 'px'
    }

    /**
     * @description 渲染 SwiperItem
     * @returns 渲染的SwiperItem
     */
    const renderSwiperItems = () => {
        const publcStyle = direction === 'horizontal' ? { width: rootStyle.width } : { height: rootStyle.height }
        return React.Children.map((children || []), (child, i) => {
            const style = { ...publcStyle }
            console.log(direction, touch.deltaX.current, touch.deltaY.current)

            /* if (currentIndex.current === 0) {

            } else if (currentIndex.current === swiperItemCount - 1) {

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
    const renderIndicators = (count = swiperItemCount, activeIndex: number = currentIndex.current): React.ReactNode => {
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
                className='bin-swiper-track'
                style={{ width: getTrackRefWidth() }}
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
