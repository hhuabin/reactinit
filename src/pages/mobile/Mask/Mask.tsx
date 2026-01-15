import { useState, useEffect } from 'react'

import Mask from '@/components/mobile/Mask'
import { Mask as AntdMask } from 'antd-mobile'

const MaskComponents: React.FC = () => {

    const [visible, setVisible] = useState(false)
    const [antdVisible, setAntdVisible] = useState(false)

    return (
        <>

            <div className='w-full min-h-screen bg-[var(--color-bg-layout)]'>
                <div className='w-full p-6 text-[#697b8c] text-[16px]'>基础用法</div>
                <ul role='list' className='w-[43.875rem] mx-auto rounded-[1rem] bg-[var(--color-bg-container)] text-[var(--color-text)] text-[2rem] leading-10'>
                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[42rem] after:h-px
                        after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => setVisible(true)}
                        >
                            <div className='flex-none min-w-64 mr-10'>显示背景蒙层</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'></div>
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
                            onClick={() => setAntdVisible(true)}
                        >
                            <div className='flex-none min-w-64 mr-10'>显示antd背景蒙层</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'></div>
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

            <Mask
                visible={visible}
                onMaskClick={() => setVisible(false)}
            ></Mask>

            <AntdMask
                visible={antdVisible}
                onMaskClick={() => setAntdVisible(false)}
            ></AntdMask>
        </>
    )
}

export default MaskComponents
