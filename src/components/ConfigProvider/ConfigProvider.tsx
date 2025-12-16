/**
 * @Author: bin
 * @Date: 2025-07-01 16:37:01
 * @LastEditors: bin
 * @LastEditTime: 2025-12-16 10:48:39
 */
import { useContext, useMemo } from 'react'
import { ConfigContext, type ConfigConsumerProps } from './context'

const { Provider, Consumer } = ConfigContext

type ConfigProviderProps = Partial<ConfigConsumerProps> & {
    children?: React.ReactNode;
}

// 全局配置组件
const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {

    // 解构出除 children 外的所有属性
    const { children, ...config } = props

    const context = useContext(ConfigContext)

    const mergeConfig: ConfigConsumerProps = useMemo(() => ({ ...context, ...config }), [context, config])

    return (
        <Provider value={mergeConfig}>
            { children }
        </Provider>
    )
}

export default ConfigProvider
