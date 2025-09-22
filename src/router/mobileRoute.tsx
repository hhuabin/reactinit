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
                    const { default: Guide } = await import('@/pages/mobile/Guide/Guide')
                    return { Component: Guide }
                },
                meta: {
                    auth: false,
                    title: 'guide',
                },
            },
            {
                path: 'message',
                lazy: async () => {
                    const { default: Message } = await import('@/pages/mobile/Message/Message')
                    return { Component: Message }
                },
                meta: {
                    auth: false,
                    title: 'message',
                },
            },
            {
                path: 'picker',
                lazy: async () => {
                    const { default: Picker } = await import('@/pages/mobile/Picker/Picker')
                    return { Component: Picker }
                },
                meta: {
                    auth: false,
                    title: 'picker',
                },
            },
            {
                path: 'swiper',
                lazy: async () => {
                    const { default: Swiper } = await import('@/pages/mobile/Swiper/Swiper')
                    return { Component: Swiper }
                },
                meta: {
                    auth: false,
                    title: 'swiper',
                },
            },
        ],
    },
]
