/**
 * 封装动画方法
 * @param { Function } callback 每一帧执行的回调函数，接收 progress 和 elapsedTime 作为参数
 * - progress 为当前动画的进度，取值范围从 0 到 1
 * - elapsedTime 为当前动画已经执行的时间，单位为毫秒
 * @param { number } duration 动画总时长，单位为毫秒，默认为 1000ms
 * @param { number } interval 动画每一帧执行的间隔时间，单位为毫秒，默认为一帧的时间，建议不小于16.67ms（即 60Hz 的一帧时间）
 * @returns { Object } 包含 start 和 stop 方法的对象
 */
const createAnimation = (callback: (progress: number, elapsedTime: number) => void, duration = 1000, interval = 0) => {
    let startTime: number | null = null    // 动画起始时间
    let lastFrameTime: number | null       // 上一帧的时间
    let requestID: number | null           // reques进度tAnimationFrame 的 ID

    const animate = (timestamp: number) => {
        if (startTime === null) {
            startTime = timestamp
            lastFrameTime = timestamp
        }

        // 计算经过的时间
        const elapsedTime = timestamp - startTime
        // 计算动画进度（0 到 1 之间）
        const progress = Math.min(Math.max(elapsedTime / duration, 0), 1)

        if (timestamp - lastFrameTime! > interval || progress === 1) {
            // 更新上一帧时间
            lastFrameTime = timestamp
            // 执行回调函数，更新动画状态
            callback(progress, elapsedTime)
        }

        // 1s 内持续执行动画（大约20ms更新一次）
        if (progress < 1) {
            // 继续请求下一帧
            requestID = window.requestAnimationFrame(animate)
        } else {
            requestID = null
            startTime = null
            lastFrameTime = null
        }
    }

    return {
        start: () => {
            // 开始动画
            requestID = window.requestAnimationFrame(animate)
        },
        stop: () => {
            // 停止动画
            requestID && window.cancelAnimationFrame(requestID)
            requestID = null
            startTime = null
            lastFrameTime = null
        },
    }
}

export default createAnimation
