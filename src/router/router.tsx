import { redirect, Navigate } from 'react-router-dom'

import type { RouteConfig } from './types'

export const routes: RouteConfig[] = [
    {
        path: '/',
        lazy: async () => {
            const { default: Home } = await import('@/pages/Home/Home')
            // const RedirectCom = () => (<><Home/><Navigate to="/login" replace /></>)   // 重定向(不可重定向至子路由，子路由使用 index)
            return { Component: Home }
        },
        meta: {
            auth: false,
        },
    },
    {
        lazy: async () => {
            const { default: GlobalLayout } = await import('@/pages/GlobalLayout')
            return { Component: GlobalLayout }
        },
        children: [
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
        ],
    },
]
