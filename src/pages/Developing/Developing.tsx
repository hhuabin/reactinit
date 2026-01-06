/**
 * @Author: bin
 * @Date: 2025-06-09 10:10:06
 * @LastEditors: bin
 * @LastEditTime: 2026-01-06 10:01:34
 */
import { useEffect, useState } from 'react'

import { Button, Image, ImageViewer, Swiper } from 'antd-mobile'

import ImagePreview from '@/components/mobile/ImagePreview'

const Developing: React.FC = () => {

    const [visible, setVisible] = useState(false)
    const [antdVisible, setAntdVisible] = useState(false)

    const demoViewImages = [
        'https://fastly.picsum.photos/id/61/800/1600.jpg?hmac=8w5YZlCCmheDmzJBSunayYfvTaJEDTRpJO82P6nYm_c',
        'https://fastly.picsum.photos/id/361/400/2400.jpg?hmac=-ZmwFiEqRxZmnmNY8Gmj9im4r9XKpmCyx3H1GQKwFhU',
        'https://fastly.picsum.photos/id/355/2400/400.jpg?hmac=J100SKrb_04nR2yMCz1LwGXCaXTb4rXvkRtTt6kE408',
        'https://images.unsplash.com/photo-1601128533718-374ffcca299b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3128&q=80',
        // 'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3113&q=80',
        // 'https://images.unsplash.com/photo-1624993590528-4ee743c9896e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=1000&q=80',
    ]

    return (
        <div className='w-full'>
            <div className='w-full'>
                <ImagePreview
                    visible={visible}
                    images={demoViewImages}
                    onClose={() => {
                        setVisible(false)
                    }}
                ></ImagePreview>
            </div>
            <div className='w-full'>
                <Image
                    src='https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
                    width={100}
                    height={100}
                    fit='fill'
                />
                <div className='w-full h-[160px]'>
                    <Swiper>
                        <Swiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] text-[24px] bg-[#ace0ff]'>1</div>
                        </Swiper.Item>
                        <Swiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] text-[24px] bg-[#bcffbd]'>2</div>
                        </Swiper.Item>
                        <Swiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] text-[24px] bg-[#ffcfac]'>3</div>
                        </Swiper.Item>
                    </Swiper>
                </div>
                <Button
                    onClick={() => {
                        setVisible(true)
                    }}
                >
                    显示自定义组件图片
                </Button>
                <Button
                    onClick={() => {
                        setAntdVisible(true)
                    }}
                >
                    显示Antd组件图片
                </Button>
                <ImageViewer.Multi
                    classNames={{
                        mask: 'customize-mask',
                        body: 'customize-body',
                    }}
                    images={demoViewImages}
                    visible={antdVisible}
                    onClose={() => {
                        setAntdVisible(false)
                    }}
                />
            </div>
        </div>
    )
}

export default Developing
