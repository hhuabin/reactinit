import { useEffect, useRef } from 'react'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import { renderToContainer } from './utils/renderToContainer'
import './Mask.less'
import { on } from 'events'

/**
 * @description 主要实现功能：
 * 1. 蒙层进入、退出动画
 */

type MaskProps = {
    visible?: boolean;                         // 是否显示
    duration?: number;                         // 动画时长
    zIndex?: number;                           // 蒙层层级
    disableBodyScroll?: boolean;               // 是否禁用 body 滚动
    closeOnPopstate?: boolean;                 // 是否在 popstate 时关闭图片预览，默认值 true
    closeOnClickOverlay?: boolean;             // 是否在点击遮罩层后关闭，默认值 true
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    getContainer?: HTMLElement | (() => HTMLElement) | null;       // 指定挂载的节点
    onMaskClick?: () => void;                  // 点击遮罩层时触发
    afterClose?: () => void;                   // 完全关闭后触发
    children?: JSX.Element;                    // Mask children
}

const Mask: React.FC<MaskProps> = (props) => {

    const {
        visible = true,
        duration = 300,
        zIndex = 999,
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
        onChange: (value) => { onMaskClick?.() },
    })
    const maskRef = useRef<HTMLDivElement | null>(null)

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
            onMaskClick?.()
        }
    }

    return renderToContainer(
        <div
            ref={maskRef}
            role='button'
            className={'bin-mask' + (className ? ' ' + className : '') + (mergeVisible ? '' : ' bin-mask-hidden')}
            style={{
                ...style,
                '--animation-duration': duration ? duration + 'ms' : (style as Record<string, string>)['--animation-duration'],
            }  as React.CSSProperties }
            onClick={(event) => handleMaskClick(event)}
        >
            { children }
        </div>,
        getContainer,
    )
}

export default Mask
