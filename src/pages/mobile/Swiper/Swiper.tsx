import Swiper, { SwiperItem } from '@/components/mobile/Swiper'

const SwiperComponent: React.FC = () => {

    return (
        <div className='py-4 text-[#fff]'>
            <div className='w-[45rem] mx-auto'>
                <div className='w-full text-[#697b8c] text-[16px]'>基础用法</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical'>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-[45rem] mx-auto my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>自动播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper autoplay={true}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical' autoplay={true}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-[45rem] mx-auto my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>循环播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper loop={true}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical' loop={true}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-[45rem] mx-auto my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>自定义轮播项宽 / 高度</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper loop={true} slideItemSize={300}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical' loop={true} slideItemSize={120}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-[45rem] mx-auto my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>循环居中播放</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper loop={true} basicOffset={30} slideItemSize={300}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical' loop={true} basicOffset={20} slideItemSize={120}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>

            <div className='w-[45rem] mx-auto my-8'>
                <div className='w-full text-[#697b8c] text-[16px]'>自定义指示器</div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper loop={true} indicator={() => (<></>)}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
                <div className='w-full h-[160px] mt-4'>
                    <Swiper direction='vertical' loop={true} indicator={() => (<></>)}>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
                        </SwiperItem>
                        <SwiperItem>
                            <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ffcfac]'>3</div>
                        </SwiperItem>
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default SwiperComponent
