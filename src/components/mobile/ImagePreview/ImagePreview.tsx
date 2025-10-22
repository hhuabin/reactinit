import Swiper from '@/components/mobile/Swiper'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import './ImagePreview.less'

type ImagePreviewProps = {
    visible?: boolean;                        // 是否显示
    alt?: string;
    current?: number;
    images?:  string[];
    getContainer?: string;
    onClose?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {

    const {
        visible,
        onClose,
    } = props

    const [mergeVisible, setMergeVisible] = useMergedState(false, {
        value: visible,
        onChange: (value) => {},
    })

    const closeImagePreview = () => {
        setMergeVisible(false)
        onClose?.()
    }

    const indicator = (total: number, current: number) => {
        return (<div className="bin-image-preview-indicator">{ (current + 1) +  ' / ' + total }</div>)
    }

    if (mergeVisible) {
        return (
            <div role='button' className='bin-overlay' onClick={() => closeImagePreview()}>
                <Swiper indicator={indicator}>
                    <Swiper.SwiperItem>
                        <div className="bin-image-preview">
                            <div className='bin-image' style={{
                                transform: 'matrix(1, 0, 0, 1, 0, 0)',
                            }}>
                                <img src='https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg' alt='' />
                            </div>
                        </div>
                    </Swiper.SwiperItem>
                    <Swiper.SwiperItem>
                        <div className="bin-image-preview">
                            <div className='bin-image' style={{
                                transform: 'matrix(1, 0, 0, 1, 0, 0)',
                            }}>
                                <img src='https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg' alt='' />
                            </div>
                        </div>
                    </Swiper.SwiperItem>
                </Swiper>
            </div>
        )
    } else {
        return null
    }
}

export default ImagePreview
