/**
 * @Author: bin
 * @Date: 2025-09-17 16:58:55
 * @LastEditors: bin
 * @LastEditTime: 2026-01-21 09:35:55
 */
export type SwiperItemProps = {
    width?: number;
    height?: number;
    transition?: string;
    transform?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode | (() => React.ReactNode);
}

export const SwiperItem: React.FC<SwiperItemProps> = (props) => {

    const {
        width,
        height,
        transition,
        transform,
        className = '',
        style = {},
        children = null,
    } = props

    return (
        <div
            className={`bin-swiper-item${className ? ' ' + className : ''}`}
            style={{
                ...style,
                width: width + 'px',
                height: height + 'px',
                transition,
                transform,
            }}
        >
            { typeof children === 'function' ? children() : children }
        </div>
    )
}

export default SwiperItem
