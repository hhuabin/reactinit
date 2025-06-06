/**
 * @Author: bin
 * @Date: 2025-04-16 18:37:07
 * @LastEditors: bin
 * @LastEditTime: 2025-06-06 10:34:10
 */
import { Outlet, useNavigation } from 'react-router-dom'

import Loading from '@/components/Loading/Loading'

const GlobalLayout: React.FC = () => {

    const navigation = useNavigation()

    if (navigation.state === 'loading') {
        return <Loading />
    } else {
        return <Outlet />
    }
}

export default GlobalLayout
