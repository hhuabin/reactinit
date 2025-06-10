import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { message } from 'antd'

import style from './Message.module.less'
import type { ArgsProps, NoticeType } from './message.d'
import { getIcon } from './getIcon'
import { message as myMessage } from '@/components/Message'

const Message: React.FC = () => {

    const [messages, setMessages] = useState<ArgsProps[]>([])

    const addMessage = () => {
        const message = { content: 'loading...' }
        setMessages((prev) => ([
            ...prev,
            message,
        ]))
    }

    const removeMessage = () => {
        messages.shift()
        setMessages([...messages])
    }

    const antdShowMessage = () => {
        message.info('loading...', () => {
            console.log('关闭')
        }, () => {
            console.log('点击')
        })
        .then((res) => {
            console.log('loading 被关闭了！可以做下一步操作', res)
        })
    }

    const showMyMessage = () => {
        myMessage.info('loading...', 0, () => {
            console.log('关闭')
        })
    }

    const antdShowSuccess = () => {
        message.success('success')
        .then(() => {
            console.log('success')
        })
    }

    const messageContent = (noticeType: NoticeType = 'info') => (
        <div className={style.message}>
            {
                messages.map((message, index) => (
                    <div className={style['message-notice-wrapper']} key={index}>
                        <div className={style['message-notice']}>
                            <div className={style['ant-message-notice-content']}>
                                <div className={style['ant-message-custom-content']}>
                                    <span className={style['message-icon']}>
                                        { getIcon(noticeType) }
                                    </span>
                                    <span>{message.content}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )

    return (
        <>
            {
                createPortal(
                    messageContent(),
                    document.body,
                )
            }
            <div className='w-full'>
                <button
                    type='button'
                    className='px-4 border border-[var(--color-border)] rounded-md text-[1em] bg-[var(--bg-color)]
                    text-[var(--color-text)] leading-8 hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                    onClick={() => addMessage()}
                >
                    <span>addMessage</span>
                </button>
                <button
                    type='button'
                    className='px-4 border border-[var(--color-border)] rounded-md text-[1em] bg-[var(--bg-color)]
                    text-[var(--color-text)] leading-8 hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                    onClick={() => removeMessage()}
                >
                    <span>removeMessage</span>
                </button>
                <button
                    type='button'
                    className='px-4 border border-[var(--color-border)] rounded-md text-[1em] bg-[var(--bg-color)]
                    text-[var(--color-text)] leading-8 hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                    onClick={() => antdShowMessage()}
                >
                    <span>antd showLoading</span>
                </button>
                <button
                    type='button'
                    className='px-4 border border-[var(--color-border)] rounded-md text-[1em] bg-[var(--bg-color)]
                    text-[var(--color-text)] leading-8 hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                    onClick={() => showMyMessage()}
                >
                    <span>showMyMessage</span>
                </button>
            </div>
        </>
    )
}

export default Message
