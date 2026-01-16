import { useNavigate } from 'react-router-dom'

const Guide: React.FC = () => {

    const navigate = useNavigate()

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg-layout)]'>
            <div className='w-full py-6'>
                <ul role='list' className='w-[43.875rem] mx-auto rounded-[1rem] bg-[var(--color-bg-container)] text-[var(--color-text)] text-[2rem] leading-10'>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/message')}
                        >
                            <div className='flex-none min-w-64 mr-10'>Message</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>消息提示</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/mask')}
                        >
                            <div className='flex-none min-w-64 mr-10'>Mask</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>Mask背景蒙层</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/picker')}
                        >
                            <div className='flex-none min-w-64 mr-10'>Picker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>Picker选择器</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/swiper')}
                        >
                            <div className='flex-none min-w-64 mr-10'>Swiper</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>Swiper轮播图</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/imagePreview')}
                        >
                            <div className='flex-none min-w-64 mr-10'>ImagePreview</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>图片预览</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => navigate('/mobile/upload')}
                        >
                            <div className='flex-none min-w-64 mr-10'>Upload</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>Upload文件上传</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Guide
