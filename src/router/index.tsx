import { Suspense } from 'react'
import { createHashRouter, redirect, RouterProvider } from 'react-router-dom'
import type { RouteObject, LoaderFunction, NonIndexRouteObject } from 'react-router-dom'

import store from '@/store/store'
import { routes } from './router'
import type { RouteConfig } from './router'

import Loading from "@/components/Loading/Loading"

const createRoutes = (routes: RouteConfig[]): RouteObject[] => {
    return routes.map((route): RouteObject => {
        const loader: LoaderFunction = () => {
            // 公共路由守卫
            const token = store.getState().user.userInfo.token
            if (!token && route.meta?.auth) {
                throw redirect("/login")
            }
            document.title = (route.meta?.title as string) || "react"
            return null
        }
        return {
            path: route.path ?? undefined,
            id: route.id ?? undefined,
            index: (route.index as NonIndexRouteObject['index']) ?? undefined,
            element: route.element ?? undefined,
            loader: route.loader ?? loader,
            lazy: route.lazy ?? undefined,
            errorElement: route.errorElement ?? undefined,
            children: route.children ? createRoutes(route.children) : undefined,
        }
    })
}

const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<Loading />}>
            <RouterProvider router={ createHashRouter(createRoutes(routes)) }></RouterProvider>
        </Suspense>
    )
}

export default AppRouter
