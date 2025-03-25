/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * LocalStorageUtil 兼容 localStorage，可以使用 localStorage 的所有 API
 * 但是会进行序列化与反序列化，方便存储复杂对象
 * 同时为了方便使用，使用 try...catch 来捕获可能的错误
 */
export default class LocalStorageUtil {

    // 公共前缀。可以为项目存储的 key 添加公共前缀，避免与系统冲突
    public static STORAGE_PREFIX = ""

    /**
     * @description 对 value 进行序列化，并保存到 localStorage
     * @param { string } key localStorage 的键
     * @param { any } value 需要存储的值，此处不需要调用stringify序列化对象
     * @param { boolean } keyPrefixFlag 是否添加公共前缀，默认为 true
     */
    public static setItem = (key: string, value: any, keyPrefixFlag = true) => {
        const _key = keyPrefixFlag ? this.STORAGE_PREFIX + key : key

        try {
            const serializedValue = JSON.stringify(value)
            localStorage.setItem(_key, serializedValue)
        } catch (error) {
            console.error(`Error setting localStorage key "${_key}":`, error)
        }
    }

    /**
     * @description 获取 localStorage 中存储的值，并反序列化
     * @param { string } key localStorage 的键
     * @param { any } defaultValue 默认返回值，默认为null
     * @param { boolean } keyPrefixFlag 是否添加公共前缀，默认为 true
     * @returns { T | null } 本地缓存的值或 defaultValue 默认返回值
     * @example localStorageUtil.getItem<string, string>("", "")
     */
    public static getItem = <T = any, D extends T | undefined = undefined>(
        key: string,
        defaultValue?: D,
        keyPrefixFlag = true,
    ): D extends undefined ? T | null : T => {
        const _key = keyPrefixFlag ? this.STORAGE_PREFIX + key : key
        const _defaultValue = defaultValue ?? null

        try {
            const serializedValue = localStorage.getItem(_key)
            if (serializedValue === null) {
                return _defaultValue as D extends undefined ? T | null : T
            }
            return JSON.parse(serializedValue) as T
        } catch (error) {
            console.error(`Error getting localStorage key "${_key}":`, error)
            return _defaultValue as D extends undefined ? T | null : T
        }
    }

    /**
     * @description 获取 localStorage 中存储的对象属性值
     * @param { string } key localStorage 的键
     * @param { string } property 对象的属性名
     * @param { T } defaultValue 如果属性不存在时的默认返回值
     * @param { boolean } keyPrefixFlag 是否添加公共前缀，默认为 true
     * @returns { T } 属性值或 defaultValue 默认返回值
     */
    public static getProperty = <T = any>(
        key: string,
        property: string,
        defaultValue: T,
        keyPrefixFlag = true,
    ): T => {
        const value = this.getItem(key, null, keyPrefixFlag)

        return value && value[property] !== undefined ? value[property] : defaultValue
    }

    /**
     * @description 删除 localStorage 中存储的值
     * @param { string } key localStorage 的键
     * @param { boolean } keyPrefixFlag 是否添加公共前缀，默认为 true
     */
    public static removeItem = (key: string, keyPrefixFlag = true) => {
        const _key = keyPrefixFlag ? this.STORAGE_PREFIX + key : key

        try {
            localStorage.removeItem(_key)
        } catch (error) {
            console.error(`Error removing localStorage key "${_key}":`, error)
        }
    }

    public static clear = () => {
        try {
            localStorage.clear()
        } catch (error) {
            console.error(`Error clearing localStorage:`, error)
        }
    }
}
