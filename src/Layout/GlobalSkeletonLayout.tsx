/**
 * @Author: bin
 * @Date: 2025-04-16 18:37:07
 * @LastEditors: bin
 * @LastEditTime: 2025-12-30 16:18:05
 */
import { Outlet, useNavigation } from 'react-router-dom'

import Skeleton from '@/components/Skeleton/Skeleton'

/**
 * 该功能尚处于 测试阶段
 * @description 全局默认骨架屏，可以结合 loader 使用。
 * GlobalSkeletonLayout + loader 可以在 router 路由中包裹着订单详情等组件
 */
const GlobalSkeletonLayout: React.FC = () => {

    const navigation = useNavigation()

    if (navigation.state === 'loading') {
        return <Skeleton />
    } else {
        return <Outlet />
    }
}

export default GlobalSkeletonLayout
