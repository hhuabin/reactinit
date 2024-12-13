import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { saveToken } from '@/store/slice/userSlice'
import RenderRoutes from "@/router/RenderRoutes"
import usePerformanceMonitor from "@/hooks/usePerformanceMonitor"
import "./App.less"

const App: React.FC = () => {

    usePerformanceMonitor()

    // 做登录缓存，可根据需要删除重写
    const dispatch = useDispatch()
    dispatch(saveToken({
        token: "token",
    }))

    useEffect(() => {
        console.log("import.meta.env", import.meta.env)
    }, [])

    return (
        <div id="app">
            <RenderRoutes></RenderRoutes>
        </div>
    )
}

export default App
