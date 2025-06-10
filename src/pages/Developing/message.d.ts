export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ArgsProps {
    content: React.ReactNode;
    duration?: number;
    type?: NoticeType;
    icon?: React.ReactNode;
    key?: string | number;
    style?: React.CSSProperties;
    className?: string;
    /**
     * 消息通知关闭时进行调用的回调函数
     */
    // onClose?: () => void;
    /**
     * 消息通知点击时的回调函数
     */
    // onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export type JointContent = React.ReactNode | ArgsProps

export type TypeOpen = (content: JointContent) => void

export interface MessageInstance {
    info: TypeOpen;
    success: TypeOpen;
    error: TypeOpen;
    warning: TypeOpen;
    loading: TypeOpen;
    open(args: ArgsProps): void;
    destroy(key?: React.Key): void;
}
