/**
 * @Author: bin
 * @Date: 2025-09-15 17:36:13
 * @LastEditors: bin
 * @LastEditTime: 2025-10-29 09:36:54
 */
import Swiper, { SwiperItem } from '@/components/mobile/Swiper'

import useMergedState from '@/hooks/reactHooks/useMergedState'
import './ImagePreview.less'

type ImagePreviewProps = {
    visible?: boolean;                         // 是否显示
    alt?: string;
    current?: number;
    images?:  string[];
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
    getContainer?: string;
    onClose?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {

    const {
        visible,
        className = '',
        style = {},
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
        return (<div className='bin-image-preview-indicator'>{ (current + 1) +  ' / ' + total }</div>)
    }

    if (mergeVisible) {
        return (
            <div
                role='button'
                className={`bin-overlay${className ? ' ' + className : ''}`}
                style={style}
                onClick={() => closeImagePreview()}
            >
                <Swiper indicator={indicator}>
                    <Swiper.Item>
                        <div className='bin-image-preview'>
                            <div className='bin-image' style={{
                                transform: 'matrix(1, 0, 0, 1, 0, 0)',
                            }}>
                                <img src='https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg' alt='' />
                            </div>
                        </div>
                    </Swiper.Item>
                    <Swiper.Item>
                        <div className='bin-image-preview'>
                            <div className='bin-image' style={{
                                transform: 'matrix(1, 0, 0, 1, 0, 0)',
                            }}>
                                <img src='https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg' alt='' />
                            </div>
                        </div>
                    </Swiper.Item>
                </Swiper>
            </div>
        )
    } else {
        return null
    }
}

export default ImagePreview
