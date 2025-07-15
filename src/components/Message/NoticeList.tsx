import { useState, useEffect, forwardRef } from 'react'

import type { ArgsProps } from './Message.d'
import renderIcon from './renderIcon'
import './Notification.less'

type NoticeListProps = {
    configList: (ArgsProps & { visible: boolean })[];
    onNoticeClose?: (key: React.Key) => void;
}

type NoticeProps = {
    notice: NoticeListProps['configList'][number];
    onNoticeClose?: (key: React.Key) => void;       // 隐藏该通知，触发关闭动画
    onNoticeDelete?: (key: React.Key) => void;      // 删除该通知
}

const DEFAULT_DURATION = 3000

const Notice: React.FC<NoticeProps> = (props) => {

    const { notice } = props

    useEffect(() => {
        const { duration } = notice
        console.warn('duration', duration)
        let timer: NodeJS.Timeout | null = null
        if (!duration && duration !== 0) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                props.onNoticeClose?.(notice.key!)
            }, DEFAULT_DURATION)
        } else if (duration === 0) {
            // 0 表示持久通知
        } else if (duration > 0) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                props.onNoticeClose?.(notice.key!)
            }, duration)
        }
        return () => {
            // 销毁时清除定时器
            console.error('销毁时清除定时器')
            if (timer) clearTimeout(timer)
        }
    }, [])

    // 动画执行完毕，删除该元素
    const onAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
        console.log('---------onAnimationEnd----------', event.animationName)
        if (event.animationName === 'message-move-out') {
            props.onNoticeDelete?.(notice.key!)
        }
    }

    return (
        <div
            className={'message-notice-wrapper' + (notice.visible ? '' : ' message-notice-wrapper-leave')}
            onAnimationEnd={(e) => onAnimationEnd(e)}
        >
            <div className='message-notice'>
                <div className='ant-message-notice-content'>
                    <div className='ant-message-custom-content'>
                        {
                            notice.icon
                                ? notice.icon
                                : (
                                    notice.type && <span className='message-icon'>
                                        { renderIcon(notice.type) }
                                    </span>
                                )
                        }
                        <span>{notice.content}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * 采用观察者模式，当 props.configList 变化时，同步改变 noticeList 状态
 */
const NoticeList: React.FC<NoticeListProps> = (props) => {

    const { configList } = props


    const [noticeList, setNoticeList] = useState<NoticeListProps['configList']>([])

    useEffect(() => {
        console.warn('-----------configList==========', configList, noticeList)
        // console.warn('compareConfigListAndNoticeList', configList, noticeList)
        if (!configList.length) {
            // 当传入值为空，关闭全部通知
            closeAllNotice()
        } else if (!noticeList.length) {
            // 当通知列表为空，直接赋值即可
            setNoticeList(configList)
        } else {
            /**
             * 当两个列表都有值时，精细对比
             * 该方案为核心 diff 函数
             */
            const resultList = compareConfigListAndNoticeList(configList, noticeList)
            setNoticeList(resultList)
        }
    }, [props.configList])

    /**
     * @description 对比合并提示消息列表
     * @param { NoticeListProps['configList'] } configList 新消息列表
     * @param { NoticeListProps['configList'] } noticeList 旧消息列表
     * @returns { NoticeListProps['configList'] } 新的消息列表
     */
    const compareConfigListAndNoticeList = (
        configList: NoticeListProps['configList'],
        noticeList: NoticeListProps['configList'],
    ): NoticeListProps['configList'] => {
        console.warn('compareConfigListAndNoticeList', configList, noticeList)
        const resultList: NoticeListProps['configList'] = []              // 存放返回结果
        const usedKeys = new Set()         // 存储已经被添加到 resultList 的 key

        const configMap = new Map(configList.map(item => [item.key!, item]))
        const noticeMap = new Map(noticeList.map(item => [item.key!, item]))
        const configKeys = configList.map(item => item.key!)
        const noticeKeys = noticeList.map(item => item.key!)
        const configListLengtgh = configKeys.length
        const noticeListLength = noticeKeys.length

        /**
         * @description 添加 noticeList 到 resultList 中
         * 新的数组中必须保留全部 noticeKeys
         * 遍历 noticeKeys ，将 resultList 中不存在的元素加上 visible: false
         */
        const configKeySet = new Set(configKeys)
        for (let i = 0; i < noticeListLength; i++) {
            if (configKeySet.has(noticeKeys[i])) {
                // 新的数组中存在，取新数组的值
                resultList.push(configMap.get(noticeKeys[i])!)
            } else {
                // 新数组中不存在，关闭
                resultList.push({ ...noticeMap.get(noticeKeys[i])!, visible: false })
            }
            usedKeys.add(noticeKeys[i])
        }

        /**
         * @description 遍历 configList，将新出现的 config 添加进 resultList 对应位置
         */
        let configListHead = 0        // configList 的头指针
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
                    const newConfig = configList.slice(configListHead, configIndex)
                    // 从开始查找下标开始查找，将 newConfig 插入到 resultList 中
                    for (let j = insertStartIndex; j <= resultList.length; j++) {
                        if (resultList[j]!.key === configKeys[configIndex]) {
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
                    // 没有新元素需要添加，移动 configList 头指针
                    configListHead++
                }
            }
            // 将处于 configList 末尾的新元素全部添加到 resultList 中
            if (configIndex === configListLengtgh && configListHead < configIndex) {
                resultList.push(...configList.slice(configListHead))
            }
        }

        return resultList
    }

    const onNoticeClose = (key: React.Key) => {
        props.onNoticeClose?.(key)
        closeNotice(key)
    }

    // 关闭全部通知，触发关闭动画
    const closeAllNotice = () => {
        setNoticeList(noticeList => {
            if (!noticeList.length) return noticeList
            const clone = noticeList.map(item => ({ ...item, visible: false }))
            return clone
        })
    }

    // 关闭某个通知，触发关闭动画
    const closeNotice = (key: React.Key) => {
        setNoticeList(noticeList => {
            const clone = noticeList.map(item => {
                if (item.key === key) {
                    return { ...item, visible: false }
                }
                return item
            })
            return clone
        })
    }

    // 删除单个通知
    const deleteNotice = (key: React.Key) => {
        setNoticeList(noticeList => noticeList.filter(item => item.key !== key))
    }

    return (
        <div className="message">
            {
                noticeList.map(notice => (
                    <Notice
                        key={notice.key}
                        notice={notice}
                        onNoticeClose={onNoticeClose}
                        onNoticeDelete={deleteNotice}
                    ></Notice>
                ))
            }
        </div>
    )
}

export default NoticeList
