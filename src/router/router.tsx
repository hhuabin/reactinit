import { redirect, Navigate } from 'react-router-dom'

import { mobileRoute } from './mobileRoute'

import type { RouteConfig } from './types'

export const routes: RouteConfig[] = [
    {
        path: '/',
        lazy: async () => {
            const { default: Home } = await import('@/pages/Home/Home')
            // const RedirectCom = () => (<><Home/><Navigate to='/login' replace /></>)   // 重定向(不可重定向至子路由，子路由使用 index)
            return { Component: Home }
        },
        meta: {
            auth: false,
        },
        children: [
            {
                index: true,
                element: <Navigate to='introduce' replace />,
            },
            {
                path: 'introduce',
                lazy: async () => {
                    const { default: Login } = await import('@/pages/Introduce/Introduce')
                    return { Component: Login }
                },
                meta: {
                    auth: false,
                },
            },
        ],
    },
    {
        lazy: async () => {
            const { default: GlobalLayout } = await import('@/pages/GlobalLayout')
            return { Component: GlobalLayout }
        },
        children: [
            ...mobileRoute,
            {
                path: '/fetchStream',
                lazy: async () => {
                    const { default: FetchStreamResponse } = await import('@/pages/FetchStreamResponse/FetchStreamResponse')
                    return { Component: FetchStreamResponse }
                },
                meta: {
                    title: 'fetchStream',
                    auth: false,
                },
            },
            {
                path: '/timezoneTime',
                lazy: async () => {
                    const { default: TimezoneTime } = await import('@/pages/TimezoneTime/TimezoneTime')
                    return { Component: TimezoneTime }
                },
                meta: {
                    title: 'timezone',
                    auth: false,
                },
            },
            {
                path: '/bigfile',
                lazy: async () => {
                    const { default: BigFileUpload } = await import('@/pages/BigFileUpload/BigFileUpload')
                    return { Component: BigFileUpload }
                },
                meta: {
                    title: 'timezone',
                    auth: false,
                },
            },
            {
                path: '/svgicon',
                lazy: async () => {
                    const { default: SvgIcon } = await import('@/pages/SvgIcon/SvgIcon')
                    return { Component: SvgIcon }
                },
                meta: {
                    title: 'svgicon',
                    auth: false,
                },
            },
            {
                path: 'developing',
                lazy: async () => {
                    const { default: Developing } = await import('@/pages/Developing/Developing')
                    return { Component: Developing }
                },
                meta: {
                    title: 'developing',
                    auth: false,
                },
            },
            {
                path: 'test',
                lazy: async () => {
                    const { default: Test } = await import('@/pages/Test/Test')
                    return { Component: Test }
                },
                meta: {
                    title: 'Test',
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
        ],
    },
]
