/**
 * 测试 compareConfigListAndNoticeList 方法
 */
const messageConfigList = [
    { key: '1', value: 'a.1' },
    { key: '3', value: 'a.3' },
    { key: '5', value: 'a.5' },
    { key: '6', value: 'a.6' },
    { key: '7', value: 'a.7' },
]

const noticeList = [
    { key: '1', value: 'b.1' },
    { key: '2', value: 'b.2' },
    { key: '3', value: 'b.3' },
    { key: '4', value: 'b.4' },
    { key: '5', value: 'b.5' },
]

const compareConfigListAndNoticeList = (
    messageConfigList,
    noticeList,
) => {
    const resultList = []              // 存放返回结果
    const usedKeys = new Set()         // 存储已经被添加到 resultList 的 key

    const configMap = new Map(messageConfigList.map(item => [item.key, item]))
    const noticeMap = new Map(noticeList.map(item => [item.key, item]))
    const configKeys = messageConfigList.map(item => item.key)
    const noticeKeys = noticeList.map(item => item.key)
    const configListLengtgh = configKeys.length
    const noticeListLength = noticeKeys.length

    /**
     * @description 添加 noticeList 到 resultList 中
     * 新的数组中必须保留全部 noticeKeys
     * 遍历 noticeKeys ，将 resultList 中不存在的元素加上 isClose: true
     */
    const configKeySet = new Set(configKeys)
    for (let i = 0; i < noticeListLength; i++) {
        if (configKeySet.has(noticeKeys[i])) {
            // 新的数组中存在，取新数组的值
            resultList.push(configMap.get(noticeKeys[i]))
        } else {
            // 新数组中不存在，关闭
            resultList.push({ ...noticeMap.get(noticeKeys[i]), isClose: true })
        }
        usedKeys.add(noticeKeys[i])
    }

    /**
     * @description 遍历 configList，将新出现的 config 添加进 resultList 对应位置
     */
    let configListHead = 0        // messageConfigList 的头指针
    let insertStartIndex = 0      // 记录在 resultList 中查找 config 的开始索引，加速 resultList 的查找速度
    for (let configIndex = 0; configIndex <= configListLengtgh; configIndex++) {
        /**
         * @description 将处于中间的新的 config 添加到 resultList 的对应位置
         * 具体规则：将新出现的 config 添加到 下一个 存在的 config 对应的索引位置前
         */
        if (usedKeys.has(configKeys[configIndex])) {
            // 若头指针与检查元素下表不相等，则存在新元素需要添加
            if (configListHead < configIndex) {
                // 获取新元素
                const newConfig = messageConfigList.slice(configListHead, configIndex)
                // 从开始查找下标开始查找，将 newConfig 插入到 resultList 中
                for (let j = insertStartIndex; j <= resultList.length; j++) {
                    if (resultList[j].key === configKeys[configIndex]) {
                        resultList.splice(j, 0, ...newConfig)
                        insertStartIndex = j + 1
                        break
                    }
                    if (j === resultList.length) {
                        resultList.push(...newConfig)
                        insertStartIndex = j
                    }
                }
                configListHead = configIndex + 1
            } else {
                // 没有新元素需要添加，移动 messageConfigList 头指针
                configListHead++
            }
        }
        // 将处于 messageConfigList 末尾的新元素全部添加到 resultList 中
        if (configIndex === configListLengtgh && configListHead < configIndex) {
            resultList.push(...messageConfigList.slice(configListHead))
        }
    }

    return resultList
}

console.log(compareConfigListAndNoticeList(messageConfigList, noticeList))
