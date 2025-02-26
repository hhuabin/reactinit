import { useRef, useEffect } from "react"

/**
 * 用于检测项目是否和线上最新版本相同，是否需要更新，仅生产环境生效
 * 当项目的 package.json 版本号和构建打包时间都不同，则需要更新
 * index.html需要增加 version 和 timestamp 的 meta 标签
 * vite.config.ts 需要配置自动修改 version meta 标签值为 package.json 的 version
 * vite.config.ts 需要配置自动修改 timestamp meta 标签值为当前时间戳
 * @param projectLink 项目部署地址，默认为域名根路径
 * @param realTime 是否实时检查，默认为 false
 */
const useProjectAutoUpdate = (projectLink = '/', realTime = false) => {

    // <meta name="version" content="__VERSION__" />
    const versionAndtimestampRegex = /<meta\s+name="(version|timestamp)"\s+content="([^"]+)"\s*\/?>/gi
    const projectVersion = useRef("")
    const projectBuildTime = useRef("")
    const REALTIME_DURATION = 3000

    useEffect(() => {
        if (import.meta.env.MODE !== 'production') return
        getVersionAndTimeFromLocalHtmlMeta()
        startCheckRefresh()
    }, [])

    /**
     * 获取当前（包括本地存储）页面的版本号和编译时间
     */
    const getVersionAndTimeFromLocalHtmlMeta = () => {
        const versionMeta = document.querySelector('meta[name="version"]')
        const buildTimeMeta = document.querySelector('meta[name="timestamp"]')
        projectVersion.current = versionMeta?.getAttribute('content') || ""
        projectBuildTime.current = buildTimeMeta?.getAttribute('content') || ""
    }

    /**
     * 提取链接（项目部署地址）中的版本号和构建打包时间
     * @param { string } link 项目部署地址
     * @returns { Promise<[string, string]> } [版本号, 时间戳]
     */
    const extractMetaFromLink = (link = projectLink): Promise<[string, string]> => {
        // fetch('/?timestamp='+Date.now()).then(resp=>resp.text()).then(res=>console.log(res))
        return fetch(link + '?timestamp=' + Date.now())
            .then(response => response.text())
            .then(htmlString => {
                const result: [string, string] = ["", ""]
                let match: RegExpExecArray | null
                versionAndtimestampRegex.lastIndex = 0
                while ((match = versionAndtimestampRegex.exec(htmlString)) !== null) {
                    const name = match[1]
                    if (name === "version") {
                        result[0] = match[2]
                    } else if (name === "timestamp") {
                        result[1] = match[2]
                    }
                }
                return Promise.resolve(result)
            })
            .catch(error => {
                return Promise.reject(error)
            })
    }

    // 检测项目是否需要更新
    const isProjectNeedUpdate = async (): Promise<boolean> => {
        const [version, buildTime] = await extractMetaFromLink(projectLink)
        let isNeedUpdate = false
        // 版本号和构建打包时间都不同，则需要更新
        if (version !== projectVersion.current && buildTime !== projectBuildTime.current) {
            isNeedUpdate = true
            console.warn(`current version: ${projectVersion.current}, Latest version: ${version}`)
            console.warn(`current timestamp: ${projectBuildTime.current}, Latest timestamp: ${buildTime}`)
        }
        // 避免多次弹窗更新
        projectVersion.current = version
        projectBuildTime.current = buildTime

        return isNeedUpdate
    }

    // 实时检查项目是否需要更新
    const startCheckRefresh = () => {
        setTimeout(async () => {
            const willUpdate = await isProjectNeedUpdate()
            if (willUpdate) {
                // 弹出用户更新的弹窗
                if (window.confirm('检测到更新，是否刷新页面？')) {
                    window.location.reload()
                } else {
                    // 用手取消更新，不再轮询更新
                    return
                }
            }
            // 实时检查项目是否需要更新
            realTime && startCheckRefresh()
        }, REALTIME_DURATION)
    }
}

export default useProjectAutoUpdate
