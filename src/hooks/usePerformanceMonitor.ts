import { useEffect } from 'react'

/**
 * 性能监控面板，生产环境不生效
 */
const usePerformanceMonitor = () => {

    useEffect(() => {
        // 性能监控
        if (import.meta.env.MODE === 'production') return

        // LCP监听
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lcpEntry = entries[entries.length - 1]
            console.log('LCP: ', lcpEntry.startTime, 'ms')
        })
        observer.observe({ type: 'largest-contentful-paint', buffered: true })

        // Onload Event
        setTimeout(() => {
            const paintEntries = performance.getEntriesByType('paint')
            const navigationEntries = performance.getEntriesByType('navigation')

            const navTiming = navigationEntries[0] as PerformanceNavigationTiming      // 通常只有一个导航条目
            console.log(navTiming)
            console.log('DOMContentLoaded: ', navTiming.domContentLoadedEventEnd - navTiming.startTime, 'ms')

            paintEntries.forEach((entry) => {
                if (entry.name === 'first-paint') {
                    console.log('FP: ', entry.startTime, 'ms')
                } else if (entry.name === 'first-contentful-paint') {
                    console.log('FCP: ', entry.startTime, 'ms')
                }
            })
            console.log('OnLoadTime: ', navTiming.loadEventEnd - navTiming.startTime, 'ms')
        }, 200)

        return () => {
            // 移除PerformanceObserver监听
            observer.disconnect()
        }
    }, [])
}

export default usePerformanceMonitor
