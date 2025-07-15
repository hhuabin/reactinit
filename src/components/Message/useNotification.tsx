import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'
import { createPortal } from 'react-dom'

import type { ConfigOptions, ArgsProps } from './Message.d'

import NoticeList from './NoticeList'

interface OpenTask {
    type: 'open';
    config: ArgsProps;
}

interface CloseTask {
    type: 'close';
    key: React.Key;
}

interface DestroyTask {
  type: 'destroy';
}

type Task = OpenTask | CloseTask | DestroyTask

interface NotificationAPI {
    open: (config: ArgsProps) => void;
    close: (key: React.Key) => void;
    destroy: () => void;
}

export type NotificationsRef = NotificationAPI

interface NotificationsProps {
    container?: HTMLElement | ShadowRoot;
}

let uniqueKey = 0      // 唯一key

// eslint-disable-next-line react-refresh/only-export-components
const Notifications = forwardRef((props: NotificationsProps, ref: ForwardedRef<NotificationsRef>) => {
    const { container } = props

    const [configList, setConfigList] = useState<(ArgsProps & { visible: boolean })[]>([])

    const onNoticeClose = (key: React.Key) => {
        // 动画执行后，将 item 删除
        const config = configList.find((item) => item.key === key)
        config?.onClose?.()
        setConfigList((list) => list.filter((item) => item.key !== key))
    }

    useImperativeHandle(ref, () => ({
        open: (config: ArgsProps) => {
            console.log('Notifications open', config, configList)
            // 添加 config 进入队列
            setConfigList((configList) => {
                const clone = [...configList]

                // Replace if exist
                const configIndex = clone.findIndex((item) => item.key === config.key)
                if (configIndex >= 0) {
                    // configList 存在 config.key
                    clone[configIndex] = { ...config, visible: true }
                } else {
                    // 添加进入队列
                    clone.push({ ...config, visible: true })
                }
                console.log('Notifications clone', clone)

                return clone
            })
        },
        close: (key: React.Key) => {
            onNoticeClose(key)
        },
        destroy: () => {
            console.log('Notifications destroy')
            setConfigList([])
        },
    }))

    if (!container) return null

    return createPortal(
        <NoticeList
            configList={configList}
            onNoticeClose={onNoticeClose}
        >
            {/* <div className='message'>
                {
                    configList.map((config) => (
                        <Notice
                            key={config.key}
                            config={config}
                            onNoticeClose={onNoticeClose}
                        ></Notice>
                    ))
                }
            </div> */}
        </NoticeList>,
        container,
    )
})

const useNotification = (
    rootConfig: ConfigOptions & { onAllRemoved?: VoidFunction } = {},
): readonly [NotificationAPI, React.ReactElement] => {

    const {
        getContainer = () => document.body,
    } = rootConfig

    const [container, setContainer] = useState<HTMLElement | ShadowRoot>()
    const notificationsRef = useRef<NotificationsRef>(null)

    // 任务队列，使用完即清除
    const [taskQueue, setTaskQueue] = useState<Task[]>([])

    const contextHolder = (
        <Notifications
            container={container}
            ref={notificationsRef}
        ></Notifications>
    )

    useEffect(() => {
        setContainer(getContainer())
    })

    useEffect(() => {
        // 批量处理任务
        if (notificationsRef.current && taskQueue.length) {
            taskQueue.forEach((task) => {
                switch (task.type) {
                case 'open':
                    notificationsRef.current!.open(task.config)
                    break
                case 'close':
                    notificationsRef.current!.close(task.key)
                    break

                case 'destroy':
                    notificationsRef.current!.destroy()
                    break
                }
            })
        }
        // 处理完直接清空任务，与 Message 的 flushNotice() 一样
        // 任务队列不为空时，才清空，防止造成死循环
        if (!!taskQueue.length) setTaskQueue([])
        console.log('useNotification taskQueue', taskQueue)
    }, [taskQueue])

    const open: NotificationAPI['open'] = (config: ArgsProps) => {
        console.log('useNotification open', config)

        let mergedKey: React.Key = config.key || ''
        if (!mergedKey) {
            mergedKey = `notification-${uniqueKey}`
            uniqueKey += 1
        }
        const mergedConfig: ArgsProps = { ...config, key: mergedKey }

        setTaskQueue((queue) => [...queue, { type: 'open', config: mergedConfig }])
    }

    const notificationApi = {
        open,
        close: (key: React.Key) => {
            setTaskQueue((queue) => [...queue, { type: 'close', key }])
        },
        destroy: () => {
            setTaskQueue((queue) => [...queue, { type: 'destroy' }])
        },
    }

    return [notificationApi, contextHolder]
}

export default useNotification
