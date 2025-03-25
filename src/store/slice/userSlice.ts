import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { UserInfo } from '../types/userSlice'
import LocalStorageUtil from '@/utils/storageUtils/LocalStorageUtil'

export const userSlice = createSlice({
    // 用来自动生成 action 中的 type
    name: 'user',
    initialState: {
        userInfo: <UserInfo>{
            token: LocalStorageUtil.getProperty<string>("userInfo", "token", ""),
        },
    },
    reducers: {
        saveUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo.token = action.payload.token
            LocalStorageUtil.setItem('userInfo', action.payload)
        },
        removeUserInfo: (state) => {
            state.userInfo.token = ""
            LocalStorageUtil.setItem('userInfo', "")
        },
    },
})

export const getters = {
    isLogin: (state: ReturnType<typeof userSlice.getInitialState>) => (!!state.userInfo.token),
}

export const {
    saveUserInfo, removeUserInfo,
} = userSlice.actions

export default userSlice.reducer
