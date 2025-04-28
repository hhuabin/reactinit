import { createHashRouter, redirect, RouterProvider } from 'react-router-dom'
import type { RouteObject, LoaderFunction, LazyRouteFunction, NonIndexRouteObject } from 'react-router-dom'

import store from '@/store/store'
import { routes } from './router'
import type { RouteConfig } from './types'

import Loading from '@/components/Loading/Loading'

const createRoutes = (routes: RouteConfig[]): RouteObject[] => {
    return routes.map((route): RouteObject => {
        const publicLazy: LazyRouteFunction<RouteObject> = async () => {
            const loader: LoaderFunction = () => {
                // 公共路由守卫
                const token = store.getState().user.userInfo.token
                if (!token && route.meta?.auth) {
                    throw redirect("/login")
                }
                document.title = (route.meta?.title as string) || "react"
                return {}
            }
            return { loader }
        }
        return {
            path: route.path ?? undefined,
            id: route.id ?? undefined,
            index: (route.index as NonIndexRouteObject['index']) ?? undefined,
            element: route.element ?? undefined,
            loader: route.loader ?? undefined,
            lazy: async () => {
                const defaultLazy = await publicLazy()
                const lazy = await route.lazy?.() ?? {}
                // 合并懒加载组件，必须至少返回 RouteObject 中的一个属性
                return {
                    ...defaultLazy,
                    ...lazy,
                }
            },
            errorElement: route.errorElement ?? undefined,
            children: route.children ? createRoutes(route.children) : undefined,
        }
    })
}

// 一定要这个赋值步骤，避免重复创建 Router 实例
const router = createHashRouter(createRoutes(routes))

/**
 * 禁止使用<RouterProvider router={createHashRouter(createRoutes(routes))}></RouterProvider>写法
 * AppRouter渲染时都会调用 createHashRouter(createRoutes(routes))，创建一个新的 Router 实例
 * 导致 React Router 的内部状态（如导航历史、加载状态等）被重置，进而引发页面闪烁、导航失败等问题
 */
const AppRouter: React.FC = () => (<RouterProvider router={router} fallbackElement={<Loading />} />)

export default AppRouter
