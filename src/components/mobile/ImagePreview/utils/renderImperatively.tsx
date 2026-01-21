/**
 * @Author: bin
 * @Date: 2026-01-14 09:09:06
 * @LastEditors: bin
 * @LastEditTime: 2026-01-16 11:14:00
 */
import React, {
    useState, useRef, useEffect,
    forwardRef, useImperativeHandle, type ForwardedRef,
    type ReactElement,
} from 'react'
import { renderToBody } from './reactRender'

type ImperativeProps = {
    visible?: boolean;
    onClose?: () => void;
    afterClose: () => void;
}

type TargetElement = ReactElement<ImperativeProps>

export type ImperativeHandler = {
    close: () => void;
    replace: (element: TargetElement) => void;
    isRendered?: () => boolean;
}

/**
 * @description 强制渲染函数
 * @param { TargetElement } element React元素，必须携带 afterClose 参数才能卸载组件
 * @returns { ImperativeHandler }  imperativeHandler
 */
export const renderImperatively = (element: TargetElement): ImperativeHandler => {
    let wrapperRef: ImperativeHandler | null = null

    // eslint-disable-next-line prefer-arrow-callback
    const GlobalHolderWrapper = forwardRef(function ImagePreviewWrapper(props, ref: ForwardedRef<ImperativeHandler>) {
        // 直接控制显示状态
        const [visible, setVisible] = useState(false)
        const closedRef = useRef(false)
        const [elementToRender, setElementToRender] = useState<TargetElement>(element)
        const keyRef = useRef(0)

        useEffect(() => {
            if (!closedRef.current) {
                setVisible(true)
            } else {
                afterClose()
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        // 关闭函数
        const onClose = () => {
            closedRef.current = true
            setVisible(false)
            elementToRender.props.onClose?.()
        }

        /**
         * @description 在组件完全关闭后执行 unmount() 卸载整个组件
         * 功能：等待动画执行完成，兼容动画/过渡
         */
        const afterClose = () => {
            unmount()
            elementToRender.props.afterClose?.()
        }

        useImperativeHandle(ref, () => ({
            close: onClose,
            replace: (element: TargetElement) => {
                keyRef.current++
                elementToRender.props.afterClose?.()
                setElementToRender(element)
            },
        }))

        // 将 visible, onClose, afterClose 收归 GlobalHolderWrapper 控制
        return React.cloneElement(elementToRender, {
            ...elementToRender.props,
            key: keyRef.current,
            visible,
            onClose,
            afterClose,
        })
    })

    const unmount = renderToBody((<GlobalHolderWrapper ref={node => (wrapperRef = node)} />))

    return {
        close: async () => {
            if (!wrapperRef) {
                unmount()
                element.props.afterClose?.()
            } else {
                wrapperRef.close()
            }
        },
        replace: async (element: TargetElement) => {
            wrapperRef?.replace(element)
        },
        isRendered: () => !!wrapperRef,
    }
}
