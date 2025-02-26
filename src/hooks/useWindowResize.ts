import { useLayoutEffect, useEffect } from "react"

import ThrottleDebounce from "@/utils/functionUtils/ThrottleDebounce"

/**
 * 监听浏览器窗口变化，实现自适应（大屏使用）
 * @param designWidth 设计稿宽度
 * @param designHeight 设计稿高度
 * @param renderDom 需要挂载的元素（注意不能挂载在根html上，移动端可能会出现适配问题）
 */
const useWindowResize = (designWidth = 1920, designHeight = 1080, renderDOM = '#root') => {

    const htmlResize = () => {
        const htmlElement = document.documentElement      // html元素
        const htmlClientWidth = htmlElement.clientWidth
        const htmlClientHeight = htmlElement.clientHeight
        console.log("浏览器可视窗口宽度", htmlElement.clientWidth)
        console.log("浏览器可视窗口高度", htmlElement.clientHeight)

        // 获取挂载元素
        const renderDomElement = document.querySelector(renderDOM)

        let renderDOMWith = designWidth      // 定义元素的最终宽
        let renderDOMHeight = designHeight   // 定义元素的最终高
        let scale = htmlClientWidth / designWidth

        if (htmlClientWidth / htmlClientHeight < designWidth / designHeight) {
            // 确定放大倍数
            scale = htmlClientWidth / designWidth
            // 宽高比 较小，需要以最小的为基准进行缩放。以宽度为基准，计算高度进行缩放
            renderDOMHeight = designHeight * (htmlClientHeight / designHeight / scale)
        } else if (htmlClientWidth / htmlClientHeight > designWidth / designHeight) {
            // 确定放大倍数
            scale = htmlClientHeight / designHeight
            // 宽高比 较大，需要以最小的为基准进行缩放。以高度为基准，计算宽度进行缩放
            renderDOMWith = designWidth * (htmlClientWidth / designWidth / scale)
        }

        // eslint-disable-next-line no-extra-semi
        ;(renderDomElement as HTMLElement).style.width = `${renderDOMWith}px`
        ;(renderDomElement as HTMLElement).style.height = `${renderDOMHeight}px`

        ;(renderDomElement as HTMLElement).style.transform = `scale(${scale})`
        ;(renderDomElement as HTMLElement).style.transformOrigin = '0 0'
        ;(renderDomElement as HTMLElement).style.overflow = 'hidden'
        htmlElement.style.overflow = 'hidden'
        // document.body.style.overflow = 'hidden'
        // document.body.style.scrollbarWidth = 'none'
    }

    const listenerFunction = ThrottleDebounce.debounce((event: UIEvent) => {
        htmlResize()
    }, 50)

    useLayoutEffect(() => {
        htmlResize()
    })

    useEffect(() => {
        window.addEventListener("resize", listenerFunction)
        return () => {
            window.removeEventListener("resize", listenerFunction)
        }
    }, [])
}

export default useWindowResize
