import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getters, saveUserInfo } from '@/store/slice/userSlice'
import type { RootState } from '@/store/store'
import AppRouter from '@/router'

import usePerformanceMonitor from "@/hooks/usePerformanceMonitor"
import useProjectAutoUpdate from "@/hooks/useProjectAutoUpdate"
import "./App.less"

const App: React.FC = () => {

    // 性能监控
    usePerformanceMonitor()
    // 项目自动检测更新
    useProjectAutoUpdate()

    // 做登录缓存，可根据需要删除重写
    const dispatch = useDispatch()
    const isLogin = useSelector((state: RootState) => getters.isLogin(state.user))

    useEffect(() => {
        console.log("import.meta.env", import.meta.env)
        /* dispatch(saveUserInfo({
            token: "token",
        })) */
    }, [])

    return (
        <div id="app">
            <AppRouter></AppRouter>
        </div>
    )
}

export default App
