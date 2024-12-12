import { useEffect } from 'react'

import RenderRoutes from "@/router/RenderRoutes"

import "./App.less"

const App: React.FC = () => {

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
