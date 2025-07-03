import { useEffect } from 'react'

export interface NoticeListProps {
    configList?: OpenConfig[];

    // Events
    onAllNoticeRemoved?: (placement: Placement) => void;
    onNoticeClose?: (key: React.Key) => void;
}

const NoticeList: React.FC<NoticeListProps> = (props) => {

    const {
        configList,

        onAllNoticeRemoved,
        onNoticeClose,
    } = props

    return (
        <div className='message-notice-wrapper'>
            <div className='message-notice'>
                <div className='ant-message-notice-content'>
                    <div className='ant-message-custom-content'>
                        <span className='message-icon'>
                        </span>
                        {/* <span>{message.content}</span> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoticeList
