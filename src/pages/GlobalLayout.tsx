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
