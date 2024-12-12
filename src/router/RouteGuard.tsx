import { useLocation, useMatch, Navigate } from 'react-router-dom'

import type { RouteRecordRaw } from "@/router/routerConfig"

// 是否需要重定向
const redirect = (router: RouteRecordRaw): JSX.Element => {
    if (router.redirect) {
        return (
            <>
                {router.element}
                <Navigate to={router.redirect} replace />
            </>
        )
    }
    return router.element
}

const GuardedRoute: React.FC<{ router: RouteRecordRaw }> = ({ router }) => {
    const location = useLocation()
    const match = useMatch(router.path)

    // 没有 match 即不是目标路由，可能是父路由。无需处理往下的逻辑
    if (!match) return router.element
    // 处理重定向问题
    let element = redirect(router)

    // 登录验证
    if (!router.meta?.needAuth) {
        document.title = (router.meta?.title as string) || "React"
    } else {
        // from 可以在 login 的 location.state 中接收，以便登陆后直接返回至本页
        element = <Navigate to="/" state={{ from: location }} />
    }

    return element
}

export default GuardedRoute
