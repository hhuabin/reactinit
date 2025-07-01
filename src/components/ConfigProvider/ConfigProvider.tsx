import { useState, useContext } from 'react'
import { defaultConfig, setConfigContext, ConfigContext } from './context'
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

    return (
        <Provider value={{ ...context, ...config }}>
            { children }
        </Provider>
    )
}

export default ConfigProvider
