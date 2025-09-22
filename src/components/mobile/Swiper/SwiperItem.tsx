export type SwiperItemProps = {
    width?: number;
    height?: number;
    transform?: string;
    children?: React.ReactNode;
}

export const SwiperItem: React.FC<SwiperItemProps> = (props) => {

    const { width, height, transform, children } = props

    return (
        <div
            className='bin-swiper-item'
            style={{
                width: width + 'px',
                height: height + 'px',
                transform,
            }}
        >
            {children}
        </div>
    )
}

export default SwiperItem
