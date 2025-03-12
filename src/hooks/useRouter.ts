import { useNavigate } from 'react-router-dom'
import type { NavigateFunction } from 'react-router-dom'

/**
 * 供组件外路由跳转使用
 * 使用 navigator 前请务必先初始化，如在 App.tsx 中调用初始化
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

const useRouter = () => {

    const navigate = useNavigate()

    setNavigator(navigate)

}

export default useRouter
