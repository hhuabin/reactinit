import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/userInfoSlice'

const store = configureStore({
    reducer: {
        userInfo: userReducer,
    },
})
export default store

// 声明 state, dispath 类型
// ReturnType<>：获取函数返回值的类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
