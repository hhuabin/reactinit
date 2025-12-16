/**
 * @Author: bin
 * @Date: 2025-12-16 16:07:33
 * @LastEditors: bin
 * @LastEditTime: 2025-12-16 16:41:17
 */
import store from '@/store/store'
import { saveUserInfo, removeUserInfo } from '@/store/slice/userInfoSlice'
import type { UserInfo } from '@/store/types'

/**
 * @description 非 React 场景解耦
 * auth.store.ts 暴露 userInfoSlice 的状态、方法，供非 React 函数组件调用，比如路由守卫 Loader、axios 公共请求方法等
 */

// 获取 userInfoSlice 状态
export const getAuthState = () => {
    const state = store.getState()
    const userInfo = state.userInfo.userInfo

    return {
        userInfo,
        isLogin: !!userInfo.token,
    }
}

// 登录
export const login = (userInfo: UserInfo) => {
    store.dispatch(saveUserInfo(userInfo))
}

// 登出
export const logout = () => {
    store.dispatch(removeUserInfo())
}

export default {
    getAuthState,
    login,
    logout,
}
