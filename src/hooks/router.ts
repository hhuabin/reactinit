import type { NavigateFunction } from 'react-router-dom'

/**
 * 供组件外跳转路由使用
 * 使用前请务必给 navigator 初始化，如在App.tsx 中初始化
 */

let navigator: NavigateFunction

export const setNavigator = (nav: NavigateFunction) => {
    navigator = nav
}

export const navigate = (to: string) => {
    if (navigator) {
        navigator(to)
    } else {
        console.warn("Navigator not initialized!")
    }
}
