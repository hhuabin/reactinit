import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'

const MobileLayout: React.FC = () => {

    useLayoutEffect(() => {
        document.documentElement.dataset.model = 'mobile'
        return () => {
            document.documentElement.dataset.model = ''
        }
    }, [])

    return (<Outlet />)
}

export default MobileLayout
