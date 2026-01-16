import { useEffect, useRef } from 'react'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import { renderToContainer } from './utils/renderToContainer'
import './Mask.less'

/**
 * @description 主要实现功能：
 * 1. 蒙层进入、退场动画
 * 2. 默认禁止 body 滑动
 * 3. 默认开启路由变化自动关闭蒙层
 * 4. 蒙层默认挂载到 body，在退场后不会卸载元素
 */

type MaskProps = {
    visible?: boolean;                         // 是否显示，默认为 true
    zIndex?: number;                           // 蒙层层级
    duration?: number;                         // 动画时长，单位为 ms
    bgColor?: string;                          // 蒙层背景颜色
    disableBodyScroll?: boolean;               // 是否禁用 body 滚动，默认为 true
    closeOnPopstate?: boolean;                 // 是否在 popstate 时关闭图片预览，默认值 true
    closeOnClickOverlay?: boolean;             // 是否在点击遮罩层后关闭，默认值 true
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    getContainer?: HTMLElement | (() => HTMLElement) | null;       // 指定挂载的节点
    onMaskClick?: (value?: boolean) => void;   // 点击遮罩层时触发
    afterClose?: () => void;                   // 完全关闭后触发
    children?: React.ReactNode;                // Mask children
}

const Mask: React.FC<MaskProps> = (props) => {

    const {
        visible,
        zIndex,
        duration,
        bgColor,
        disableBodyScroll = true,
        closeOnPopstate = true,
        closeOnClickOverlay = true,
        className = '',
        style = {},
        getContainer,
        onMaskClick,
        afterClose,
        children = null,
    } = props

    const [mergeVisible, setMergeVisible] = useMergedState(true, {
        value: visible,
        onChange: (value) => { onMaskClick?.(value) },
    })
    const maskRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (mergeVisible && maskRef.current) {
            maskRef.current.style.display = ''
        }
    }, [mergeVisible])

    /**
     * @description 禁止 body 滚动
     */
    useEffect(() => {
        const origin = document.body.style.overflow
        if (disableBodyScroll && mergeVisible) {
            // 禁止 body 滚动
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = origin
        }
    }, [disableBodyScroll, mergeVisible])

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

    const handleMaskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget && closeOnClickOverlay) {
            setMergeVisible(false)
        }
    }

    // 阻止滑动穿透
    const onTouchMove = (event: React.TouchEvent) => {
        if (disableBodyScroll) event.stopPropagation()
    }

    /**
     * @description 过渡结束触发
     * 相比 onAnimationEnd，不会造成初始的 bin-mask-hidden 动画执行
     */
    const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'opacity') return

        // 👇 只在「隐藏完成」时处理
        if (!mergeVisible) {
            maskRef.current && (maskRef.current.style.display = 'none')
            afterClose?.()
        }
    }
    /**
     * @description 动画结束后执行
     */
    const onAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
        // 与动画名字绑定，若修改 css 需要修改此处
        if (event.animationName === 'mask-out') {
            maskRef.current && (maskRef.current.style.display = 'none')
            afterClose?.()
        }
    }

    return renderToContainer(
        <div
            ref={maskRef}
            role='button'
            className={'bin-mask' + (className ? ' ' + className : '') + (mergeVisible ? '' : ' bin-mask-hidden')}
            style={{
                ...style,
                '--z-index': zIndex ? zIndex : (style as Record<string, string>)['--z-index'],
                '--animation-duration': duration ? duration + 'ms' : (style as Record<string, string>)['--animation-duration'],
                '--bg-color': bgColor ? bgColor : (style as Record<string, string>)['--bg-color'],
            }  as React.CSSProperties }
            onClick={(event) => handleMaskClick(event)}
            onTouchMove={onTouchMove}
            onTransitionEnd={(e) => onTransitionEnd(e)}
        >
            { children }
        </div>,
        getContainer,
    )
}

export default Mask
