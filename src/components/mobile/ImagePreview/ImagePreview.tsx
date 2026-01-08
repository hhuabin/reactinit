/**
 * @Author: bin
 * @Date: 2025-09-15 17:36:13
 * @LastEditors: bin
 * @LastEditTime: 2026-01-08 19:30:19
 */
import {
    useState, useRef, useEffect,
    forwardRef, useImperativeHandle, type ForwardedRef,
} from 'react'

import Swiper, { SwiperItem, type SwiperRef } from '@/components/mobile/Swiper'
import ImagePreviewItem from './ImagePreviewItem'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import useWindowSize from '@/hooks/deviceHooks/useWindowSize'
import { renderToContainer } from './utils'
import './ImagePreview.less'

type ImagePreviewProps = {
    visible?: boolean;                         // 是否显示，默认为 false
    direction?: 'horizontal' | 'vertical';     // 滚动方向，默认为 'horizontal'
    loop?: boolean;                            // 是否循环播放，默认值 false
    defaultIndex?: number;                     // 默认显示第几张图片，默认值 0
    images?:  string[];                        // 图片地址列表，默认值 []
    maxZoom?: number;                          // 最大缩放倍数，默认值 3
    minZoom?: number;                          // 最小缩放倍数，默认值 1 / 3
    closeOnPopstate?: boolean;                 // 是否在 popstate 时关闭图片预览，默认值 true
    closeOnClickImage?: boolean;               // 是否允许点击图片关闭，默认值 true
    closeOnClickOverlay?: boolean;             // 是否在点击遮罩层后关闭图片预览，默认值 true
    doubleScale?: boolean;                     // 是否启用双击缩放手势，禁用后，点击时会立即关闭图片预览，默认值 true
    stopPropagation?: boolean;                 // 是否阻止滑动事件冒泡，默认为 true
    showIndicator?: boolean;                   // 是否显示指示器，默认为 true
    indicator?: (total: number, current: number) => React.ReactNode;         // 自定义指示器，优先级比 showIndicator 高
    showCloseBtn?: boolean;                    // 是否显示关闭按钮，默认值 false
    renderFooter?: (index: number) => React.ReactNode;                       // 渲染底部额外内容
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    getContainer?: HTMLElement | (() => HTMLElement) | null;                 // 指定挂载的节点
    onClose?: () => void;                      // 关闭时触发
    onIndexChange?: (index: number) => void;   // 切换时触发
    onLongPress?: (index: number) => void;     // 长按当前图片时触发
}
export type ImagePreviewRef = {
    swipeTo: (index: number) => void;          // 切换到指定位置
    resetScale: () => void;                    // 重置当前图片的缩放比
}

// eslint-disable-next-line prefer-arrow-callback
export default forwardRef(function ImagePreview(props: ImagePreviewProps, ref: ForwardedRef<ImagePreviewRef>) {
    const {
        visible,
        direction = 'horizontal',
        loop = false,
        defaultIndex = 0,
        images = [],
        maxZoom = 3,
        minZoom = 1 / 3,
        closeOnPopstate = true,
        closeOnClickImage = true,
        closeOnClickOverlay = true,
        doubleScale = true,
        stopPropagation = false,
        showIndicator = true,
        indicator,
        showCloseBtn = false,
        renderFooter,
        className = '',
        style = {},
        getContainer,
        onClose,
        onIndexChange,
        onLongPress,
    } = props

    const [mergeVisible, setMergeVisible] = useMergedState(true, {
        value: visible,
        onChange: (value) => {
            onClose?.()      // 只有 closeImagePreview 触发关闭事件，其他事件均不调用 setMergeVisible
        },
    })
    const [swiperState, setSwiperState] = useState({
        active: 0,
        disableZoom: false,
    })

    const swiperWrapRef = useRef<HTMLDivElement>(null)
    const swiperRef = useRef<SwiperRef>(null)

    // 此处的宽高应该使用 Swiper 的宽高，目前仅用屏幕宽高代替
    const { width: rootWidth, height: rootHeight } = useWindowSize()

    /**
     * @description 监听 popstate 事件，返回时关闭弹窗
     */
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (closeOnPopstate) {
                setMergeVisible(false)
            }
        }

        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [closeOnPopstate, setMergeVisible])

    const onCloseImagePreview = () => {
        setMergeVisible(false)
        onClose?.()
        /* setTimeout(() => {
            if (!swiperWrapRef.current) return
            swiperWrapRef.current.style.display = 'none'
        }, 300) */
    }

    const swipeTo = (index: number) => {
        swiperRef.current?.swipeTo(index)
    }

    const onSwiperChange = (index: number) => {
        setSwiperState(prevswiperState => ({
            ...prevswiperState,
            active: index,
        }))
        onIndexChange?.(index)
    }

    const onSwiperDragStart = () => {
        setSwiperState(prevswiperState => ({
            ...prevswiperState,
            disableZoom: true,
        }))
    }

    const onSwiperDragEnd = () => {
        setSwiperState(prevswiperState => ({
            ...prevswiperState,
            disableZoom: false,
        }))
    }

    useImperativeHandle(ref, () => ({
        swipeTo,
        resetScale: () => {},
    }))

    // 默认指示器，传给 Swiper 显示
    const defaultIndicator = (total: number, current: number): React.ReactNode => {
        if (indicator) return indicator(total, current)
        if (!showIndicator) return null

        return (<div className='bin-image-preview-indicator'>{ (current + 1) +  ' / ' + total }</div>)
    }

    const renderImages = () => (
        <Swiper
            ref={swiperRef}
            direction={direction}
            loop={loop}
            defaultIndex={defaultIndex}
            stopPropagation={stopPropagation}
            showIndicator={showIndicator}
            indicator={defaultIndicator}
            onChange={onSwiperChange}
            onDragStart={onSwiperDragStart}
            onDragEnd={onSwiperDragEnd}
        >
            {
                images.map((image, index) => (
                    <SwiperItem key={index}>
                        <ImagePreviewItem
                            ref={node => {}}
                            src={image}
                            direction={direction}
                            active={swiperState.active}
                            maxZoom={maxZoom}
                            minZoom={minZoom}
                            rootWidth={rootWidth}
                            rootHeight={rootHeight}
                            closeOnClickImage={closeOnClickImage}
                            closeOnClickOverlay={closeOnClickOverlay}
                            disableZoom={swiperState.disableZoom}
                            doubleScale={doubleScale}
                            onCloseImagePreview={onCloseImagePreview}
                            onLongPress={() => onLongPress?.(index)}
                        >
                        </ImagePreviewItem>
                    </SwiperItem>
                ))
            }
        </Swiper>
    )

    const renderClose = () => {
        if (!showCloseBtn) return null
        return (
            <div
                role='button'
                className='bin-image-preview-close-btn'
                onClick={() => onCloseImagePreview()}
            >
                <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                    <line x1='32' y1='32' x2='68' y2='68' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
                    <line x1='68' y1='32' x2='32' y2='68' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
                </svg>
            </div>
        )
    }

    if (!mergeVisible) return null

    // 默认挂载到 document.body
    return renderToContainer(
        <div
            ref={swiperWrapRef}
            role='button'
            className={'bin-image-preview-overlay' + (className ? ' ' + className : '')}
            style={style}
        >
            { renderImages() }
            { renderClose() }
            { renderFooter?.(swiperState.active) }
        </div>,
        getContainer,
    )
})
