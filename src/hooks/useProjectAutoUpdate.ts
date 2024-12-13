import { useRef, useEffect } from "react"

/**
 * 自动刷新页面，用于检测项目是否需要更新，仅生产环境生效
 * vite.config.ts 的 output.entryFileNames 需设置为 'js/[name]-[hash].js'
 * @param projectLink 项目部署地址，默认为域名根路径
 * @param realTime 是否实时检查，默认为 false
 */
const useProjectAutoUpdate = (projectLink = '/', realTime = false) => {

    // <script type="module" crossorigin src="./js/index.js"></script>
    const scriptReg = new RegExp(/<script\b[^>]*src=["'](?<src>[^"']*)["'][^>]*(>[^<]*<\/script>|\/>)/, 'gm')
    const localScripts = useRef<string[]>([])
    const REALTIME_DURATION = 3000

    useEffect(() => {
        if (import.meta.env.MODE !== 'production') return
        getFirstLevelHeadAndBodyScripts()
        if (realTime) {
            realTimeRefresh()
        } else {
            startRefresh()
        }
    }, [])

    // 获取当前（包括本地存储）页面的 <head/> 和 <body/> 子元素的 <script/>的src 值
    const getFirstLevelHeadAndBodyScripts = () => {
        const headChildren: HTMLCollection = document.head.children        // 获取 head 的直接子元素，伪数组
        const bodyChildren: HTMLCollection = document.body.children        // 获取 body 的直接子元素，伪数组
        const scriptsValue = [...headChildren, ...bodyChildren].reduce((prev, current) => {
            if (current.tagName.toLowerCase() === 'script') {
                const src = current.getAttribute('src')
                if (src) {
                    return [...prev, src]
                }
            }
            return prev
        }, [] as string[])
        localScripts.current = scriptsValue
    }

    /**
     * 提取链接中的script标签
     * @param link 链接
     * @returns Promise<string[]>
     */
    const extractNewScript = (link = projectLink): Promise<string[]> => {
        // fetch('/?timestamp='+Date.now()).then(resp=>resp.text()).then(res=>console.log(res))
        return fetch(link + '?timestamp=' + Date.now())
            .then(response => response.text())
            .then(html => {
                scriptReg.lastIndex = 0
                const result: string[] = []
                let match: RegExpExecArray | null
                while ((match = scriptReg.exec(html)) !== null) {
                    result.push(match.groups!.src)
                }
                return Promise.resolve(result)
            })
            .catch(error => {
                return Promise.reject(error)
            })
    }

    /**
     * 是否需要更新
     */
    const needUpdate = async () => {
        const newScripts = await extractNewScript()
        let result = false
        if (newScripts.length !== localScripts.current.length) {
            result = true
        }
        for (let i = 0; i < newScripts.length; i++) {
            if (localScripts.current[i] !== newScripts[i]) {
                result = true
                break
            }
        }
        localScripts.current = newScripts
        return result
    }

    // 项目启动时检查项目是否需要更新
    const startRefresh = async () => {
        const willUpdate = await needUpdate()
        if (willUpdate) {
            if (window.confirm('检测到更新，是否刷新页面？')) {
                location.reload()
            }
        }
    }

    // 实时检查项目是否需要更新
    const realTimeRefresh = () => {
        setTimeout(async () => {
            const willUpdate = await needUpdate()
            if (willUpdate) {
                if (window.confirm('检测到更新，是否刷新页面？')) {
                    location.reload()
                } else {
                    return
                }
            }
            realTimeRefresh()
        }, REALTIME_DURATION)
    }
}

export default useProjectAutoUpdate
