/**
 * @Author: bin
 * @Date: 2025-07-01 16:49:29
 * @LastEditors: bin
 * @LastEditTime: 2025-10-29 09:46:39
 */
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

