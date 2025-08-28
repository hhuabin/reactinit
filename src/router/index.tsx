/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHashRouter, redirect, RouterProvider } from 'react-router-dom'
import type {
    RouteObject,
    LoaderFunction,
    LazyRouteFunction,
    NonIndexRouteObject,
    LoaderFunctionArgs,
} from 'react-router-dom'

import store from '@/store/store'
import { routes } from './router'
import type { RouteConfig } from './types'

import Loading from '@/components/Loading/Loading'

// 检查是否是空对象 {}
const isEmptyObject = (obj: any) =>
    obj !== null &&
    typeof obj === 'object' &&
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.keys(obj).length === 0

/**
 * @description 创建公共 loader 函数
 * @param route 路由配置对象
 * @returns { LoaderFunction }
 */
const createPublicLoader = (route: RouteConfig): LoaderFunction => (args: LoaderFunctionArgs<any>) => {
    // 公共路由守卫
    const token = store.getState().user.userInfo.token
    if (!token && route.meta?.auth) {
        throw redirect('/login')
    }
    document.title = (route.meta?.title as string) || 'react'
    // 功能正常返回 null
    return null
}

const createPublicLazy = (route: RouteConfig): LazyRouteFunction<RouteObject> => async () => {
    const lazy: RouteObject = await route.lazy?.() ?? {}
    const lazyOrRouteLoader = lazy.loader ?? route.loader    // lazy.loader 优先级更高
    // 获取公共loader
    const publicLoader = createPublicLoader(route)

    /**
     * @description 合并 公共loader 与自定义 loader
     * 默认公共 loader 优先级高，因为公共 loader 可能处理未登录重定向的问题
     * 有需要可自行修改
     */
    const loader: LoaderFunction = lazyOrRouteLoader ? async (args: LoaderFunctionArgs<any>) => {
        const publicDataFunctionValue = await publicLoader(args)

        if (publicDataFunctionValue && !isEmptyObject(publicDataFunctionValue)) {
            // 当 publicLoader 不返回 null | {}
            return publicDataFunctionValue
        } else {
            const loaderDataFunctionValue = await (lazyOrRouteLoader as LoaderFunction)(args)
            return loaderDataFunctionValue
        }
    } : publicLoader

    return {
        ...lazy,
        loader,
    }
}

const createRoutes = (routes: RouteConfig[]): RouteObject[] => routes.map((route): RouteObject => ({
    path: route.path ?? undefined,
    id: route.id ?? undefined,
    index: (route.index as NonIndexRouteObject['index']) ?? undefined,
    element: route.element ?? undefined,
    loader: route.loader ?? undefined,
    lazy: createPublicLazy(route),
    errorElement: route.errorElement ?? undefined,
    children: route.children ? createRoutes(route.children) : undefined,
}))

// 一定要这个赋值步骤，避免重复创建 Router 实例
const router = createHashRouter(createRoutes(routes))

/**
 * 禁止使用<RouterProvider router={createHashRouter(createRoutes(routes))}></RouterProvider>写法
 * AppRouter渲染时都会调用 createHashRouter(createRoutes(routes))，创建一个新的 Router 实例
 * 导致 React Router 的内部状态（如导航历史、加载状态等）被重置，进而引发页面闪烁、导航失败等问题
 */
const AppRouter: React.FC = () => (<RouterProvider router={router} fallbackElement={<Loading />} />)

export default AppRouter
