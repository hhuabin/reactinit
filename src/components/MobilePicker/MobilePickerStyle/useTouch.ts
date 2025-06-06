import { useRef } from 'react'

const getDirection = (x: number, y: number) => {
    if (x > y) {
        return 'horizontal'
    }
    if (y > x) {
        return 'vertical'
    }
    return ''
}

/**
 * 封装了手势相关的hooks
 */
const useTouch = () => {

    const LOCK_DIRECTION_DISTANCE = 20  // 锁定手势方向的距离
    const TAP_DETECTION_RADIUS = 10     // 点击检测半径，触摸点移动距离在此范围内才会被视为点击

    const startX = useRef(0)       // 触摸时 X 的坐标
    const startY = useRef(0)       // 触摸时 y 的坐标
    const deltaX = useRef(0)       // x 轴移动的距离，具有正负（方向）
    const deltaY = useRef(0)       // y 轴移动的距离，具有正负（方向）
    const offsetX = useRef(0)      // x 轴移动的距离，无方向
    const offsetY = useRef(0)      // y 轴移动的距离，无方向
    const direction = useRef('')   // 移动方向
    const isTap = useRef(true)     // 是否是点击事件，默认是点击，超过距离 TAP_DETECTION_RADIUS 即为滑动

    const isVertical = () => direction.current === 'vertical'
    const isHorizontal = () => direction.current === 'horizontal'

    const reset = () => {
        deltaX.current = 0
        deltaY.current = 0
        offsetX.current = 0
        offsetY.current = 0
        direction.current = ''
        isTap.current = true
    }

    const start = (event: React.TouchEvent) => {
        reset()
        const touch = event.touches[0]
        startX.current = touch.clientX
        startY.current = touch.clientY
    }

    /**
     * 计算滑动距离
     */
    const move = (event: React.TouchEvent) => {
        const touch = event.touches[0]
        // 带有正负（方向）的滑动距离
        deltaX.current = touch.clientX - startX.current
        deltaY.current = touch.clientY - startY.current
        // 滑动距离的绝对值
        offsetX.current = Math.abs(deltaX.current)
        offsetY.current = Math.abs(deltaY.current)

        // 锁定手势方向
        if (!direction.current || (offsetX.current < LOCK_DIRECTION_DISTANCE && offsetY.current < LOCK_DIRECTION_DISTANCE)) {
            direction.current = getDirection(offsetX.current, offsetY.current)
        }
        // 移动距离大于最小滑动距离，才触发滑动事件
        if (isTap.current && (offsetX.current > TAP_DETECTION_RADIUS || offsetY.current > TAP_DETECTION_RADIUS)) {
            // 非点击事件
            isTap.current = false
        }
    }

    return {
        move,
        start,
        reset,
        startX,
        startY,
        deltaX,
        deltaY,
        offsetX,
        offsetY,
        direction,
        isVertical,
        isHorizontal,
        isTap,
    }
}

export default useTouch
