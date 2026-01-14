// 统一环境变量获取
export const getEnv = () => {
    // Vite 环境
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.MODE
    }
    // Webpack/Node 环境
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
        return process.env.NODE_ENV
    }
    return 'development'
}
