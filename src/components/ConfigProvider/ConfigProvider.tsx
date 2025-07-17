import { useContext, useMemo } from 'react'
import { ConfigContext } from './context'
import type { ConfigConsumerProps } from './context'

const { Provider, Consumer } = ConfigContext

type ConfigProviderProps = Partial<ConfigConsumerProps> & {
    children?: React.ReactNode
}

// 全局配置组件
const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {

    // 解构出除了 children 的属性
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
