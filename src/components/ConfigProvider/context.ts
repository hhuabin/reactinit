import { createContext } from 'react'

type ThemeConfig = 'light' | 'dark'

export interface ConfigConsumerProps {
    theme: ThemeConfig
}

export const defaultConfig: ConfigConsumerProps = {
    theme: 'light',
}

export const setConfigContext = (config: Partial<ConfigConsumerProps>) => {
    Object.assign(defaultConfig, config)
}

export const ConfigContext = createContext<ConfigConsumerProps>(defaultConfig)

