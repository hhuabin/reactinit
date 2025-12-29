/**
 * @Author: bin
 * @Date: 2025-12-25 19:45:38
 * @LastEditors: bin
 * @LastEditTime: 2025-12-29 17:44:15
 */
import { useState, useRef, useEffect, useMemo } from 'react'

import useTouch from './useTouch'

// TODO: 滑动
// TODO: 单击关闭
// TODO: 双击放大
// TODO: 双击缩小

type ImagePreviewItemProps = {
    src: string;
    maxZoom?: number;                          // 最大缩放倍数，默认值 3
    minZoom?: number;                          // 最小缩放倍数，默认值 1 / 3
    closeOnClickImage?: boolean;               // 是否允许点击图片关闭，默认值 true
    closeOnClickOverlay?: boolean;             // 是否在点击遮罩层后关闭图片预览，默认值 true
    doubleScale?: boolean;                     // 是否启用双击缩放手势，禁用后，点击时会立即关闭图片预览，默认值 true
}


const ImagePreviewItem: React.FC<ImagePreviewItemProps> = (props) => {

    const {
        src,
        maxZoom = 3,
        minZoom = 1 / 3,
        closeOnClickImage = true,
        closeOnClickOverlay = true,
        doubleScale = true,
    } = props

    const [state, setState] = useState({
        scale: 1,
        moveX: 0,
        moveY: 0,
        moving: false,
        zooming: false,
        initializing: false,
        imageRatio: 0,
    })

    const touchStartTime = useRef(0)                        // 触摸开始时间，用于惯性滚动判定
    const fingerNum = useRef(0)                             // 当前触摸点数量

    const touch = useTouch()

    const imageStyle = useMemo(() => {
        const { scale, moveX, moveY, moving, zooming, initializing } = state
        const style: React.CSSProperties = {
            transitionDuration: zooming || moving || initializing ? '0s' : '.3s',
        }

        if (scale !== 1) {
            // use matrix to solve the problem of elements not rendering due to safari optimization
            style.transform = `matrix(${scale}, 0, 0, ${scale}, ${moveX}, ${moveY})`
        }

        return style
    }, [state])

    const onTouchStart = (event: React.TouchEvent) => {
        console.log('touch start', event)
        const { touches } = event
        fingerNum.current = touches.length

        if (fingerNum.current === 2) return

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

    return (
        <div className='bin-image-preview'
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
        >
            <div
                className='bin-image-preview-image'
                style={ imageStyle }
            >
                <img src={src} alt='' />
            </div>
        </div>
    )
}

export default ImagePreviewItem
