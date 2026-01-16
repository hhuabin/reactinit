/**
 * @Author: bin
 * @Date: 2026-01-04 10:36:21
 * @LastEditors: bin
 * @LastEditTime: 2026-01-16 14:38:54
 */

// SSR、RSC 安全
export const isBrowser = typeof window !== 'undefined'

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
