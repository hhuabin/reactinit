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
    onClose?: () => void;
    /**
     * 消息通知点击时的回调函数
     */
    // onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export type JointContent = React.ReactNode | ArgsProps

/**
 * @descCN 函数用于关闭消息通知，函数中有.then()方法，可以被调用
 */
export interface MessageType extends PromiseLike<boolean> {
    (): void;
}

export type TypeOpen = {
    /**
     * @param { number } duration 消息通知持续显示的时间
     * @param { VoidFunction } onClose 消息通知关闭时进行调用的回调函数
     */
    (content: JointContent, onClose?: VoidFunction): MessageType;
    (content: JointContent, duration?: number, onClose?: VoidFunction): MessageType;
}

export interface BaseMethods {
    open(args: ArgsProps): void;
    destroy(key?: React.Key): void;
}

export interface MessageMethods {
    info: TypeOpen;
    success: TypeOpen;
    error: TypeOpen;
    warning: TypeOpen;
    loading: TypeOpen;
}

export interface MessageInstance extends MessageMethods, BaseMethods {}
