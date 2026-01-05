/**
 * @Author: bin
 * @Date: 2025-12-25 19:45:38
 * @LastEditors: bin
 * @LastEditTime: 2026-01-05 15:00:06
 */
// https://picsum.photos/800/1600 随机生成图片尺寸的网址
import { useState, useRef, useEffect, useMemo } from 'react'

import Image from '@/components/mobile/Image'

import useSyncState from '@/hooks/reactHooks/useSyncState'
import useTouch from './useTouch'
import { isBrowser, clamp } from './utils'

// TODO: 滑动
// TODO: 单击关闭
// TODO: 双击放大
// TODO: 双击缩小

type ImagePreviewItemProps = {
    src: string;
    maxZoom?: number;                          // 最大缩放倍数，默认值 3
    minZoom?: number;                          // 最小缩放倍数，默认值 1 / 3
    rootWidth?: number;                        // 窗口宽度
    rootHeight?: number;                       // 窗口高度
    closeOnClickImage?: boolean;               // 是否允许点击图片关闭，默认值 true
    closeOnClickOverlay?: boolean;             // 是否在点击遮罩层后关闭图片预览，默认值 true
    doubleScale?: boolean;                     // 是否启用双击缩放手势，禁用后，点击时会立即关闭图片预览，默认值 true
}

const longImageRatio = 2.6                     // 长图 高宽 比，超过该比例为长图（只处理长图，不对宽图进行特殊处理）
// 获取两指之间的直线距离
const getDistance = (touches: TouchList) =>
    Math.sqrt(
        (touches[0].clientX - touches[1].clientX) ** 2 +
        (touches[0].clientY - touches[1].clientY) ** 2,
    )
// 获取两指的中心点（中点）
const getCenter = (touches: TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
})

const ImagePreviewItem: React.FC<ImagePreviewItemProps> = (props) => {

    const {
        src,
        maxZoom = 3,
        minZoom = 1 / 3,
        rootWidth = 0,
        rootHeight = 0,
        closeOnClickImage = true,
        closeOnClickOverlay = true,
        doubleScale = true,
    } = props

    const [state, setState] = useSyncState({
        scale: 1,                      // 缩放倍数
        moveX: 0,                      // 移动距离 X
        moveY: 0,                      // 移动距离 Y
        moving: false,                 // 是否正在移动
        zooming: false,                // 是否正在缩放
        initializing: false,           // 是否正在初始化，用于处理长图初始化显示有滚动的问题，仅在 resize() 中改变状态
        imageRatio: 0,                 // 图片 高宽 比，用于处理长图
    })
    const [isLongImage, setIsLongImage] = useState(false)            // 是否长图
    const [isVerticalImage, setIsVerticalImage] = useState(false)    // (屏幕宽高比 < 图片宽高比 < 长图)为 true 时，改动 css 样式

    const initialMoveY = useRef(0)                         // 只用于 长图 的初始化，让中段内容可见而计算出来的 初始纵向平移距离，
    const fingerNum = useRef(0)                            // 当前手势起始时的手指数，只在 touchStart 赋值一次
    const startMoveX = useRef(0)                           // 图片在本次拖拽开始前的 x 轴位移，须叠加历史位移
    const startMoveY = useRef(0)                           // 图片在本次拖拽开始前的 y 轴位移，须叠加历史位移
    const startScale = useRef(0)                           // 双指缩放开始时的 scale，放大倍数
    const startDistance = useRef(0)                        // 双指刚按下时的距离，作为缩放比例的分母
    const lastCenter = useRef({ x: 0, y: 0 })              // 最近一次双指缩放时的中心点，用于 touchend 时的“回弹修正”
    const doubleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)    // 用来判断 单击 or 双击 的定时器
    const touchStartTime = useRef<number>(0)               // 手指按下的时间戳，判断 tap / longPress
    const isImageMoved = useRef(false)                     // 这次手势是否真的拖动了图片，解决 图片拖拽 vs Swipe 冲突

    const touch = useTouch()

    const imageStyle = useMemo(() => {
        const { scale, moveX, moveY, moving, zooming, initializing } = state()
        /**
         * 当 zooming || moving || initializing 时，没有动画（动画时长为0）
         */
        const style: React.CSSProperties = {
            transitionDuration: zooming || moving || initializing ? '0s' : '.3s',
        }

        if (scale !== 1 || isLongImage) {
            // use matrix to solve the problem of elements not rendering due to safari optimization
            style.transform = `matrix(${scale}, 0, 0, ${scale}, ${moveX}, ${moveY})`
        }

        return style
    }, [state, isLongImage])

    // x 轴最大移动距离
    const maxMoveX = (): number => {
        if (state().imageRatio) {
            /**
             * @description 当图片以「高度撑满」的方式显示（竖图场景）
             * 此时需要使用 rootHeight / state().imageRatio 计算图片真实宽度(imageWidth)，避免横向拖出空白
             * 解释：高度撑满，则有1. imageHeight = rootHeight 又有 2. imageRatio = imageHeight(rootHeight) / imageWidth
             * 则 imageWidth = rootHeight / state().imageRatio
             */
            const displayWidth = isVerticalImage
                ? rootHeight / state().imageRatio
                : rootWidth
            return Math.max(0, (state().scale * displayWidth - rootWidth) / 2)
        }

        return 0
    }
    // y 轴最大移动距离
    const maxMoveY = (): number => {
        if (state().imageRatio) {
            // 当图片以「宽度撑满」的方式显示（横图 / 普通图场景）
            // 此时需要使用 rootWidth * state().imageRatio 计算，避免纵向拖出空白
            /**
             * @description 当图片以「宽度撑满」的方式显示（横图 / 普通图场景）
             * 此时需要使用 rootWidth * state().imageRatio 计算图片真实高度(imageHeight)，避免纵向拖出空白
             * 解释：宽度撑满，则有1. imageWidth = rootWidth 又有 2. imageRatio = imageHeight / imageWidth(rootWidth)
             * 则 imageHeight = rootWidth * state().imageRatio
             */
            const displayHeight = isVerticalImage
                ? rootHeight
                : rootWidth * state().imageRatio
            return Math.max(0, (state().scale * displayHeight - rootHeight) / 2)
        }
        return 0
    }

    const setScale = (scale: number, center?: { x: number; y: number }) => {
        scale = clamp(scale, +minZoom, +maxZoom + 1)

        if (scale !== state().scale) {
            state().scale = scale

            if (center) {
                // TODO 有中点的放大情况
                const ratio = scale / state().scale
            } else {
                state().moveX = 0
                state().moveY = 0
            }
        }
    }
    const resetScale = () => {
        setScale(1)
    }

    /**
     * @description 触摸开始事件处理
     * @param event 触摸事件
     * onTouchStart 不负责 移动，只是负责给本次触摸事件进行定性，是什么事件?
     * 1. 点击 / 双击 事件
     * 2. 拖拽图片（drag） 事件
     * 3. 双指缩放（zoom） 事件
     * 4. 还是交给 Swipe 去翻页 事件
     */
    const onTouchStart = (event: React.TouchEvent) => {
        console.log('touch start', event)
        const { touches } = event
        fingerNum.current = touches.length
        // 3. 双指缩放（zoom） 事件
        if (fingerNum.current === 2) return

        const { offsetX } = touch
        touch.start(event)

        touchStartTime.current = Date.now()
    }
    const onTouchMove = (event: React.TouchEvent) => {

        // 未滑动到边界，禁止传导事件至 Swiper
        // 拦截滑动事件
        event.stopPropagation()
    }
    const onTouchEnd = (event: React.TouchEvent) => {
        console.log('touch end', Date.now() - touchStartTime.current)
        // let stopPropagation = false


        // 检测是否是点击事件
        checkTap(event)
    }

    /**
     * 检测点击
     */
    const checkTap = (event: React.TouchEvent) => {
        const deltaTime = Date.now() - touchStartTime.current
    }

    const resize = () => {
        // 获取根元素的高宽比
        const rootRatio = rootHeight / rootWidth
        const { imageRatio } = state()

        // 图片高宽比 是否 大于屏幕小于长图
        setIsVerticalImage(imageRatio > rootRatio && imageRatio < longImageRatio)
        // 长图判定
        const _isLongImage = imageRatio > rootRatio && imageRatio >= longImageRatio
        setIsLongImage(_isLongImage)

        // 如果判定为长图，会在初始化阶段强制把图片「向上偏移到中间可视区」
        // 并进入一个短暂的 initializing 状态，随后重置缩放
        if (_isLongImage) {
            initialMoveY.current = (imageRatio * rootWidth - rootHeight) / 2
            setState((prevState) => ({
                ...prevState,
                moveY: initialMoveY.current,
                initializing: true,
            }))
            // SSR、RSC 安全
            if (isBrowser) {
                window.requestAnimationFrame(() => {
                    setState((prevState) => ({
                        ...prevState,
                        initializing: false,
                    }))
                })
            }
        }

        resetScale()
    }

    /**
     * @description 图片加载完成，更新图片的 高宽 比
     * @param event React 合成事件（load），事件源为 HTMLImageElement
     */
    const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {

        const { naturalWidth, naturalHeight } = event.currentTarget
        setState((prevState) => ({ ...prevState, imageRatio: naturalHeight / naturalWidth }))

        resize()
    }

    return (
        <div className='bin-image-preview'
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
        >
            <Image
                src={src}
                className={'bin-image-preview-image' + isVerticalImage ? ' bin-image-preview-image-vertical' : ''}
                style={ imageStyle }
                onLoad={onLoad}
            ></Image>
        </div>
    )
}

export default ImagePreviewItem
