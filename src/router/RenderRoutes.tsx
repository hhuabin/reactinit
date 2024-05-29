import { Suspense } from "react"
import { Routes, Route } from 'react-router-dom'

import { routes } from "./routerConfig"
import type { RouteRecordRaw } from "./routerConfig"
import GuardedRoute from "./RouteGuard"
import Loading from "@/components/Loading/Loading";

const RenderRoutes: React.FC = () => {

	const createRoutes = (routes: Array<RouteRecordRaw>) => {
		return routes.map((item) => {
			return (
				<Route path={item.path} element={
					<GuardedRoute router={item}></GuardedRoute>
				} key={item.path}>
					{item?.children && createRoutes(item.children)}
				</Route>
			)
		})
	}

	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				{createRoutes(routes)}
			</Routes>
		</Suspense>
	)
}

export default RenderRoutes
