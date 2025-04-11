import { redirect, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

export type RouteConfig = RouteObject & {
    children?: RouteConfig[];
    meta?: Record<string | number | symbol, unknown>;
}

export const routes: RouteConfig[] = [
    {
        path: '/',
        lazy: async () => {
            const { default: Home } = await import('@/pages/Home/Home')
            // const RedirectCom = () => (<><Home/><Navigate to="/login" replace /></>)   // 重定向(不可重定向至子路由)
            return { Component: Home }
        },
        meta: {
            auth: false,
        },
    },
    {
        path: '*',
        lazy: async () => {
            const { default: NotFound } = await import('@/pages/NotFound/NotFound')
            return { Component: NotFound }
        },
        meta: {
            title: 'notfound',
            auth: false,
        },
    },
]
