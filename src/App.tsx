import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { saveToken } from '@/store/slice/userSlice'
import RenderRoutes from "@/router/RenderRoutes"
import "./App.less"

const App: React.FC = () => {

	// 做登录缓存，可根据需要删除重写
	const dispatch = useDispatch()
	dispatch(saveToken({
		token: "token"
	}))

	useEffect(() => {
		// 性能监控
		console.log("import.meta.env", import.meta.env.MODE)
		if (import.meta.env.MODE === 'production') return

		// LCP监听
		const observer = new PerformanceObserver((entryList) => {
			const entries = entryList.getEntries()
			const lcpEntry = entries[entries.length - 1]
			console.log("lcpEntry", lcpEntry);
			
			console.log('LCP:' + lcpEntry.startTime + 'ms')
		});
		observer.observe({ type: 'largest-contentful-paint', buffered: true })

		// Onload Event
		setTimeout(() => {
			const navigationEntries = performance.getEntriesByType('navigation')
			const navTiming = navigationEntries[0] as PerformanceNavigationTiming      // 通常只有一个导航条目
			console.log(navTiming)
			console.log('DOMContentLoaded:', navTiming.domContentLoadedEventEnd - navTiming.startTime + 'ms')
			console.log('OnLoadTime:', navTiming.loadEventEnd - navTiming.startTime + 'ms')
		}, 100)

		return () => {
			// 移除PerformanceObserver监听
			observer.disconnect();
		}
	}, [])

	return (
		<div id="app">
			<RenderRoutes></RenderRoutes>
		</div>
	);
}

export default App;
