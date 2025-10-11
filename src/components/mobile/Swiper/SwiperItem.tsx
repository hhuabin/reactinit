export type SwiperItemProps = {
    width?: number;
    height?: number;
    transition?: string;
    transform?: string;
    children?: React.ReactNode;
}

export const SwiperItem: React.FC<SwiperItemProps> = (props) => {

    const { width, height, transition, transform, children } = props

    return (
        <div
            className='bin-swiper-item'
            style={{
                width: width + 'px',
                height: height + 'px',
                transition,
                transform,
            }}
        >
            {children}
        </div>
    )
}

export default SwiperItem
