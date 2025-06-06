import { Navigate } from 'react-router-dom'

import type { RouteConfig } from './types'

export const mobileRoute: RouteConfig[] = [
    {
        path: '/mobile',
        lazy: async () => {
            const { default: MobileLayout } = await import('@/pages/mobile/MobileLayout')
            return { Component: MobileLayout }
        },
        meta: { auth: false },
        children: [
            {
                index: true,
                element: <Navigate to='guide' replace />,
            },
            {
                path: 'guide',
                lazy: async () => {
                    const { default: MobileHome } = await import('@/pages/mobile/Guide/Guide')
                    return { Component: MobileHome }
                },
                meta: {
                    auth: false,
                    title: 'guide',
                },
            },
        ],
    },
]
