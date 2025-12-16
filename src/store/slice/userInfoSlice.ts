/**
 * @Author: bin
 * @Date: 2024-05-29 22:12:59
 * @LastEditors: bin
 * @LastEditTime: 2025-12-16 16:38:11
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '../types/userSlice'
import LocalStorageUtil from '@/utils/storageUtils/LocalStorageUtil'

const defaultUserInfo: UserInfo = {
    token: '',
}
const isNeedEncrypt = import.meta.env.MODE === 'production'
// 获取缓存的 userInfo
const storageUserInfo = LocalStorageUtil.getItem<UserInfo>('user_info', defaultUserInfo, true, isNeedEncrypt)

export const userInfoSlice = createSlice({
    // 用来自动生成 action 中的 type
    name: 'userInfo',
    initialState: {
        userInfo: storageUserInfo,
    },
    reducers: {
        saveUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo.token = action.payload.token
            LocalStorageUtil.setItem('user_info', action.payload)
        },
        removeUserInfo: (state) => {
            state.userInfo.token = ''
            LocalStorageUtil.setItem('user_info', defaultUserInfo)
        },
    },
})

export const {
    saveUserInfo, removeUserInfo,
} = userInfoSlice.actions

export default userInfoSlice.reducer
