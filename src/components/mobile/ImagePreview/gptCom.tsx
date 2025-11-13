/* import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Swiper, { SwiperItem } from '@/components/mobile/Swiper'

export type ImageItem = {
    src: string
    alt?: string
    thumbnail?: string
}

export type ImagePreviewProps = {
    images: ImageItem[]
    defaultIndex?: number
    visible?: boolean
    onVisibleChange?: (visible: boolean) => void
    onClose?: () => void
    loop?: boolean
    showIndicators?: boolean
    showClose?: boolean
    showIndex?: boolean
    className?: string
    portal?: boolean
}

function useLockBodyScroll(lock: boolean) {
    useEffect(() => {
        if (!lock) return
        const original = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = original
        }
    }, [lock])
}

export default function ImagePreview({
    images,
    defaultIndex = 0,
    visible: visibleProp,
    onVisibleChange,
    onClose,
    loop = true,
    showIndicators = true,
    showClose = true,
    showIndex = true,
    className = '',
    portal = true,
}: ImagePreviewProps) {
    const [internalVisible, setInternalVisible] = useState(!!visibleProp)
    const visible = visibleProp === undefined ? internalVisible : visibleProp

    const [index, setIndex] = useState(defaultIndex)
    const swiperRef = useRef<any>(null)

    useLockBodyScroll(visible)

    const close = useCallback(() => {
        if (visibleProp === undefined) setInternalVisible(false)
        onVisibleChange?.(false)
        onClose?.()
    }, [visibleProp, onVisibleChange, onClose])

    useEffect(() => {
        if (visible) setIndex(defaultIndex)
    }, [visible])

    // 双指缩放与拖拽逻辑
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const lastTouch = useRef<{ distance: number; center: { x: number; y: number } } | null>(null)
    const lastMove = useRef<{ x: number; y: number } | null>(null)

    const getDistance = (t1: Touch, t2: Touch) => {
        const dx = t1.clientX - t2.clientX
        const dy = t1.clientY - t2.clientY
        return Math.hypot(dx, dy)
    }

    const getCenter = (t1: Touch, t2: Touch) => ({
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
    })

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const [t1, t2] = e.touches
            lastTouch.current = {
                distance: getDistance(t1, t2),
                center: getCenter(t1, t2),
            }
        } else if (e.touches.length === 1 && scale > 1) {
            lastMove.current = {
                x: e.touches[0].clientX - offset.x,
                y: e.touches[0].clientY - offset.y,
            }
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastTouch.current) {
            const [t1, t2] = e.touches
            const newDistance = getDistance(t1, t2)
            const scaleRatio = newDistance / lastTouch.current.distance
            const newScale = Math.min(3, Math.max(1, scale * scaleRatio))
            setScale(newScale)
        } else if (e.touches.length === 1 && lastMove.current && scale > 1) {
            const x = e.touches[0].clientX - lastMove.current.x
            const y = e.touches[0].clientY - lastMove.current.y
            setOffset({ x, y })
        }
    }

    const handleTouchEnd = () => {
        lastTouch.current = null
        lastMove.current = null
    }

    const resetZoom = () => {
        setScale(1)
        setOffset({ x: 0, y: 0 })
    }

    const content = (
        <div
            role='dialog'
            aria-modal='true'
            className={`fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center ${className}`}
            onClick={e => {
                if (e.target === e.currentTarget) close()
            }}
        >
            {showClose && (
                <button
                    aria-label='close'
                    onClick={close}
                    className='absolute top-4 right-4 z-60 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur'
                >
                    ✕
                </button>
            )}

            {showIndex && (
                <div className='absolute top-4 left-4 text-white text-sm bg-black/40 px-3 py-1 rounded z-60'>
                    {index + 1}/{images.length}
                </div>
            )}

            <Swiper
                ref={swiperRef}
                defaultIndex={defaultIndex}
                loop={loop}
                onChange={i => {
                    setIndex(i)
                    resetZoom()
                }}
                className='w-full h-full'
            >
                {images.map((img, i) => (
                    <SwiperItem key={i}>
                        <div
                            className='w-full h-full flex justify-center items-center overflow-hidden touch-none'
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                src={img.src}
                                alt={img.alt ?? `image-${i}`}
                                className='max-w-none max-h-none'
                                draggable={false}
                                style={{
                                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                                    transition: 'transform 0.1s ease-out',
                                }}
                                onClick={e => e.stopPropagation()}
                            />
                        </div>
                    </SwiperItem>
                ))}
            </Swiper>

            {showIndicators && images.length > 1 && (
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-60'>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => swiperRef.current?.swipeTo(i)}
                            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )

    if (!visible) return null

    return portal ? createPortal(content, document.body) : content
}
 */
