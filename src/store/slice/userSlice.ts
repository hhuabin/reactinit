import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import CookieUtil from '@/utils/StorageUtils/CookieUtil'
import type { Token } from '../types/userSlice'

export const userSlice = createSlice({
    // 用来自动生成 action 中的 type
    name: 'user',
    initialState: {
        token: CookieUtil.get("token") || "",
    },
    reducers: {
        saveToken: (state, action: PayloadAction<Token>) => {
            state.token = action.payload.token
            CookieUtil.set({
                name: "token",
                value: action.payload.token,
                expires: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 保鲜30天
            })
        },
        removeToken: (state) => {
            state.token = ""
            CookieUtil.unset({ name: "token" })
        },
    },
})

export const {
    saveToken, removeToken,
} = userSlice.actions

export default userSlice.reducer
