/**
 * @Author: bin
 * @Date: 2026-01-04 15:33:22
 * @LastEditors: bin
 * @LastEditTime: 2026-01-20 15:04:36
 */
/**
 * @Author: bin
 * @Date: 2026-01-04 15:33:22
 * @LastEditors: bin
 * @LastEditTime: 2026-01-20 10:00:21
 */
import { useState, useRef, useEffect } from 'react'

import { defaultLoadingIcon, defaultErrorIcon } from './renderIcon'
import './Image.less'

/**
 * @description 与 <img /> 相比
 * 1. 默认开启懒加载
 * 2. 增加 loading 状态（支持渐进加载）
 * 3. 增加 error 状态
 * 4. 监听 onLoad、onError、onLoadEnd 事件
 */

type ImageProps = {
    src?: string;                              // 图片地址
    alt?: string;                              // 替代文本
    width?: number | string;                   // 图片宽度，默认值 auto，若是 number 类型，则单位是 px
    height?: number | string;                  // 图片高度，默认值 auto，若是 number 类型，则单位是 px
    fit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';    // 图片填充模式，默认值 'contain'
    showLoading?: boolean;                     // 是否显示加载中，默认值 true
    showError?: boolean;                       // 是否显示加载失败，默认值 true
    lazyLoad?: boolean;                        // 是否懒加载，默认值 true
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    loadingIcon?: React.ReactNode | ((src: string) => React.ReactNode);    // 加载时提示的占位元素，渐进式加载可用
    errorIcon?: React.ReactNode | ((src: string) => React.ReactNode);      // 加载失败时提示的占位元素
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;      // 图片加载完成事件
    onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;     // 图片加载失败事件
    onLoadEnd?: (event: React.SyntheticEvent<HTMLImageElement>) => void;   // 图片完成事件，不管失败还是成功都会执行
}

const Image: React.FC<ImageProps> = (props) => {

    const {
        src = '',
        alt = '',
        width = '',
        height = '',
        fit = 'contain',
        showLoading = true,
        showError = true,
        lazyLoad = true,
        className = '',
        style = {},
        loadingIcon,
        errorIcon,
    } = props

    const [shouldLoad, setShouldLoad] = useState(!lazyLoad)      // 图片是否可以加载，用于图片懒加载

    /**
     * @description 图片状态 idle loading loaded error
     * idle: 图片初始状态，图片未开始加载
     * loading: 图片正在加载中
     * loaded: 图片加载完成
     * error: 图片加载失败
     * 状态变化过程 'idle' -> shouldLoad === true -> 'loading' -> onLoad() -> 'loaded'
     *                                                        -> onError() -> 'error'
     */
    const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')

    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (!src) {
            setImageStatus('idle')
            return
        }

        if (shouldLoad) {
            setImageStatus('loading')
        }
    }, [src, shouldLoad])

    // 处理不触发 onLoad() 事件的情况
    useEffect(() => {
        if (imageStatus !== 'loading') return
        if (!imageRef.current) return
        /**
         * @description for nextjs ssr
         * 处理 图片在 effect 执行前就已经加载完成 的场景，比如 cache 命中
         * 否则会永远等不到 onLoad 事件
         * @extends
         * imageRef.current?.complete === true 图片的加载流程结束
         * imageRef.current.naturalWidth > 0 成功加载并解码图片
         * naturalWidth 表示图片资源本身的“原始像素宽度”；ImagePreview 组件也用到了
         */
        if (
            imageRef.current.complete &&
            imageRef.current.naturalWidth > 0
        ) {
            setImageStatus('loaded')
        }
    }, [imageStatus])

    /**
     * @description 图片懒加载
     * 懒加载的原理是监听图片是否进入可视区域，如果进入则加载图片
     */
    useEffect(() => {
        if (!lazyLoad || shouldLoad) return
        if (!containerRef.current) return

        // IntersectionObserver 和 <img loading={lazyLoad ? 'lazy' : 'eager'} /> 选用其一即可；这里使用 IntersectionObserver
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // 图片容器进入可视区域，加载图片
                setShouldLoad(true)
                observer.disconnect()
            }
        })
        observer.observe(containerRef.current as HTMLElement)

        return () => {
            observer.disconnect()
        }
    }, [lazyLoad, shouldLoad])

    /**
     * @description 图片加载完成事件
     * @param event React 合成事件（load），事件源为 HTMLImageElement
     */
    const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
        setImageStatus('loaded')
        props.onLoad?.(event)
        props.onLoadEnd?.(event)
    }
    const onError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        setImageStatus('error')
        props.onError?.(event)
        props.onLoadEnd?.(event)
    }

    /**
     * @description 渲染图片
     * @returns 图片元素
     */
    const renderImage = () => {
        /**
         * 1.不传 src，不展示图片
         * 2.图片未开始加载，不展示图片
         * 3.图片可以展示失败占位符 并且 加载失败，不展示图片
         */
        if (
            !src ||
            imageStatus === 'idle' ||
            (showError && imageStatus === 'error')
        ) {
            return null
        }

        return (
            <img
                ref={imageRef}
                src={shouldLoad ? src : undefined}
                className={'bin-image-' + fit}
                onLoad={onLoad}
                onError={onError}
                alt={alt}
            />
        )
    }

    /**
     * @description 占位元素：渲染加载中 / 加载失败的元素
     */
    const renderPlaceholder = () => {
        if (!src) return null
        if (imageStatus === 'loading' && showLoading) {
            // 优先显示用户传入的占位符，否则使用内置的
            return typeof loadingIcon === 'function'
                ? (<div className='bin-image-loading'>{ loadingIcon(src) }</div>)
                : loadingIcon
                    ? (<div className='bin-image-loading'>{ loadingIcon }</div>)
                    : (<div className='bin-image-loading'>{ defaultLoadingIcon }</div>)
        }
        if (imageStatus === 'error' && showError) {
            return typeof errorIcon === 'function'
                ? (<div className='bin-image-error'>{ errorIcon(src) }</div>)
                : errorIcon
                    ? (<div className='bin-image-error'>{ errorIcon }</div>)
                    : (<div className='bin-image-error'>{ defaultErrorIcon }</div>)
        }
        return null
    }

    return (
        <div
            ref={containerRef}
            className={`bin-image${className ? ' ' + className : ''}`}
            style={{
                ...style,
                width: width ? (typeof width === 'number' ? `${width}px` : width) : style['width'],
                height: height ? (typeof height === 'number' ? `${height}px` : height) : style['height'],
            }}
        >
            {renderImage()}
            {renderPlaceholder()}
        </div>
    )
}

export default Image
