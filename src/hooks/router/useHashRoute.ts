import { useState, useLayoutEffect } from 'react'

/**
 * @description 简单的hash路由
 * @example const [route, routeData] = useHashRoute()
 */
const useHashRoute = () => {

    const [route, setRoute] = useState<string>('/')
    const [routeData, setRouteData] = useState<object | null>(null)

    useLayoutEffect(() => {
        const hash = window.location.hash.slice(1).split('?')[0]
        setRoute(hash || '/')

        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.slice(1).split('?')[0]
            setRoute(newHash || '/')
        })

        return () => {
            window.removeEventListener('hashchange ', () => {})
        }
    }, [])

    return [route, routeData]
}
export default useHashRoute
