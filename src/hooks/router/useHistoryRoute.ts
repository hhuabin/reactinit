import { useState, useLayoutEffect } from 'react'

/**
 * @description 简单的history路由
 * @example const [route, routeData] = useHistoryRoute()
 */
const useHistoryRoute = () => {

    const [route, setRoute] = useState<string>('/')
    const [routeData, setRouteData] = useState<object | null>(null)

    useLayoutEffect(() => {
        setRoute(window.location.hash)

        window.addEventListener('popstate', (event) => {
            setRoute(event.state?.path || window.location.pathname)
            setRouteData(event.state?.data || null)
        })

        return () => {
            window.removeEventListener('popstate', () => {})
        }
    }, [])

    return [route, routeData]
}
export default useHistoryRoute
