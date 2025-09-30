import { useEffect, useState } from 'react'
import Swiper, { SwiperItem } from '@/components/mobile/Swiper'
import { Swiper as AntdSwiper } from 'antd-mobile'

const SwiperComponent: React.FC = () => {

    const [width, setWidth] = useState<number | string>('100%')


    return (
        <div className='py-4'>
            <div className='w-full px-4'>
                <div className='w-full text-[#697b8c] text-[16px]'>基础用法</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper>
                        <SwiperItem key={111}>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>0</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>1</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>自动播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical'>
                        <SwiperItem key={222}>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>0</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>1</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>循环播放</div>
                <div className='w-full h-[160px] mt-4'>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>手动播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <AntdSwiper loop={false}>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#1989fa] text-[16px]'>000</div>
                        </AntdSwiper.Item>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#ace0ff] text-[16px]'>111</div>
                        </AntdSwiper.Item>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#bcffbd] text-[16px]'>222</div>
                        </AntdSwiper.Item>
                    </AntdSwiper>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>循环居中播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <AntdSwiper loop={false} direction='vertical'>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#1989fa] text-[16px]'>000</div>
                        </AntdSwiper.Item>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#ace0ff] text-[16px]'>111</div>
                        </AntdSwiper.Item>
                        <AntdSwiper.Item>
                            <div className='flex justify-center items-center w-full h-[160px] bg-[#bcffbd] text-[16px]'>222</div>
                        </AntdSwiper.Item>
                    </AntdSwiper>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>自定义指示器</div>
                <div className='w-full h-[160px] mt-4'>
                </div>
            </div>

            <div className='w-full px-4 my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>纵向滚动</div>
                <div className='w-full h-[160px] mt-4'>
                </div>
            </div>
        </div>
    )
}

export default SwiperComponent
