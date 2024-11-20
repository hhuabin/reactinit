export default class CookieUtil {

    /**
     * 获取单个 cookie
     * @param name string
     * @returns string
     */
    public static get = (name: string): string | null => {
        const cookieName = `${encodeURIComponent(name)}=`,
            cookieStart = document.cookie.indexOf(cookieName)
        let cookieValue = null

        if (cookieStart > -1) {
            let cookieEnd = document.cookie.indexOf(";", cookieStart)
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
        }

        return cookieValue
    }

    /**
     * 返回当前路径下的所有 cookie
     * @returns Record<string, string>
     */
    public static getAll = (): Record<string, string> => {
        const result: Record<string, string> = {}
        const cookie = document.cookie
        if (cookie.length < 1) return result

        const cookieArray = cookie.split("; ")
        for (const element of cookieArray) {
            const cookieElement = element.split('=')
            result[cookieElement[0]] = cookieElement[1]
            // bug: 同名的cookie会被覆盖掉 例如 / 和 /home 下都有一个名为 name 的 cookie，此时只有 / 的 name 被返回
        }

        return result
    }

    /* CookieUtil.set({
        name: "",
        value: "",
        expires: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 保鲜30天，默认会话结束后删除（Session）
        path: "/", 指定可以访问该 Cookie 的路径。默认情况下，它的path将是设置Cookie的页面的路径，只有设置该 Cookie 的路径及其子路径可以访问该 Cookie。
        domain: "",  指定可以访问该 Cookie 的域名。默认情况下，只有设置该 Cookie 的域名可以访问该 Cookie。
        secure: false，指定是否仅通过安全连接（HTTPS）传输该 Cookie。默认情况下，该标识为 false，即可以通过 HTTP 和 HTTPS 传输该 Cookie。
    }) */

    /**
     * 设置Cookie
     * @param params 参数对象
     * @param params[name] Cookie名称
     * @param params[value] Cookie值
     * @param params[expires] 过期时间
     * @param params[path] 路径，默认当前页
     * @param params[domain] 域
     * @param params[secure] 安全标志
     */
    public static set = (params: { name: string, value: string, expires?: Date | number, path?: string, domain?: string, secure?: boolean }) => {
        const { name, value, expires, path, domain, secure = false } = params

        let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

        if (expires) {
            if (typeof expires === "number") {
                cookieText += `; expires=${new Date(expires).toUTCString()}`
            } else {
                cookieText += `; expires=${(expires as Date).toUTCString()}`
            }
        }

        if (path) cookieText += `; path=${path}`

        if (domain) cookieText += `; domain=${domain}`

        if (secure) cookieText += `; secure`

        document.cookie = cookieText
    }

    /**
     * 删除单个 cookie
     * @param params
     */
    public static unset = (params: { name: string, path?: string, domain?: string, secure?: boolean }) => {
        CookieUtil.set({
            ...params,
            value: "",
            expires: new Date(0),
        })
    }
}
