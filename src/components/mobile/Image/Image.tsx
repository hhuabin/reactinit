/**
 * @Author: bin
 * @Date: 2026-01-04 15:33:22
 * @LastEditors: bin
 * @LastEditTime: 2026-01-04 16:41:19
 */
import { useState, useRef, useEffect } from 'react'

import './Image.less'

type ImageProps = {
    src: string;                               // 图片地址
    alt?: string;                              // 替代文本
    fit?: 'contain' | 'cover' | 'fill';        // 图片填充模式，默认值 'contain'
    showLoading?: boolean;                     // 是否显示加载中，默认值 true
    showError?: boolean;                       // 是否显示加载失败，默认值 true
    lazyLoad?: boolean;                        // 是否懒加载，默认值 true
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;      // 图片加载完成事件
    onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;     // 图片加载失败事件
}

const Image: React.FC<ImageProps> = (props) => {

    const {
        src,
        alt = '',
        fit = 'contain',
        showLoading = true,
        showError = true,
        lazyLoad = true,
        className = '',
        style = {},
    } = props

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)

    /**
     * @description 图片加载完成事件
     * @param event React 合成事件（load），事件源为 HTMLImageElement
     */
    const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
        if (loading) {
            setLoading(false)
        }
        props.onLoad?.(event)
    }
    const onError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        setLoading(false)
        setError(true)
        props.onError?.(event)
    }

    /**
     * @description 渲染图片
     * @returns 图片元素
     */
    const renderImage = () => {
        if (error || !src) return null

        // 为懒加载准备，现在懒得写
        /* if (lazyLoad) {
            return <img ref={imageRef} v-lazy={src} />
        } */

        return (
            <img
                ref={imageRef}
                src={src}
                className={fit}
                onLoad={onLoad}
                onError={onError}
                alt={alt}
            />
        )
    }

    /**
     * @description 渲染加载中 / 加载失败的占位元素
     * @returns 占位元素
     */
    const renderPlaceholder = () => {
        if (loading && showLoading) {
            return (
                <div className='bin-image-loading'>
                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                        <circle cx='25' cy='50' r='6' fill='#f4f4f4'>
                            <animate attributeName='cx' values='25;50;25' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#f4f4f4;#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                        <circle cx='50' cy='50' r='6' fill='#f4f4f4'>
                            <animate attributeName='r' values='6;9;6' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#f4f4f4;$#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                        <circle cx='75' cy='50' r='6' fill='#f4f4f4'>
                            <animate attributeName='cx' values='75;50;75' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#f4f4f4;$#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                    </svg>
                </div>
            )
        }
        if (error && showError) {
            return (
                <div className='bin-image-error'>
                    <svg width='100%' height='100%' viewBox='0 0 100 75' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M3 60L3 3L97 3L97 72L3 72L3 57L20 40L45 60L75 30L97 60' stroke='white' strokeWidth='6'
                            fill='none' strokeLinecap='round' strokeLinejoin='round' />
                        <circle cx='25' cy='20' r='6' stroke='white' strokeWidth='5' fill='none' strokeLinecap='round' />
                    </svg>
                </div>
            )
        }
        return null
    }

    return (
        <div
            className={`bin-image${className ? ' ' + className : ''}`}
            style={style}
        >
            {renderImage()}
            {renderPlaceholder()}
        </div>
    )
}

export default Image
