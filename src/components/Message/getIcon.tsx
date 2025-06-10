import type { NoticeType } from './Message.d'

const info = (
    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='45' stroke='#1677ff' strokeWidth='8' fill='#1677ff' strokeLinecap='round' />
        <circle cx='50' cy='25' r='5' fill='#fff' />
        <line x1='50' y1='42' x2='50' y2='75' stroke='#fff' strokeWidth='8' strokeLinecap='round' />
    </svg>
)

const success = (
    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='45' stroke='#52c41a' strokeWidth='8' fill='#52c41a' strokeLinecap='round' />
        <path d='M30 50L45 65L70 35' stroke='#fff' strokeWidth='8' fill='none' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
)

const error = (
    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='45' stroke='#ff4d4f' strokeWidth='8' fill='#ff4d4f' strokeLinecap='round' />
        <line x1='35' y1='35' x2='65' y2='65' stroke='#fff' strokeWidth='8' strokeLinecap='round' />
        <line x1='65' y1='35' x2='35' y2='65' stroke='#fff' strokeWidth='8' strokeLinecap='round' />
    </svg>
)

const warning = (
    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='45' stroke='#faad14' strokeWidth='8' fill='#faad14' strokeLinecap='round' />
        <line x1='50' y1='25' x2='50' y2='58' stroke='#fff' strokeWidth='8' strokeLinecap='round' />
        <circle cx='50' cy='75' r='5' fill='#fff' />
    </svg>
)

const loading = (
    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='36' stroke='white' strokeWidth='8' fill='none' strokeLinecap='round' />
        <circle cx='50' cy='50' r='36' stroke='var(--primary-color)' strokeWidth='8' fill='none' strokeDasharray='70.5 155.7' strokeLinecap='round'>
            <animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='1s' repeatCount='indefinite' />
        </circle>
    </svg>
)
export const getIcon = (noticeType: NoticeType = 'info'): JSX.Element => {
    switch (noticeType) {
    case 'info':
        return info
    case 'success':
        return success
    case 'error':
        return error
    case 'warning':
        return warning
    case 'loading':
        return loading
    default:
        return info
    }
}
