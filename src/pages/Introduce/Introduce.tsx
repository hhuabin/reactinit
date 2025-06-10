/**
 * @Author: bin
 * @Date: 2025-06-04 11:42:38
 * @LastEditors: bin
 * @LastEditTime: 2025-06-09 10:06:06
 */
import { useNavigate } from 'react-router-dom'

import { Modal } from 'antd'

import useDeviceType from '@/hooks/useDeviceType'

const Introduce: React.FC = () => {

    const navigate = useNavigate()

    const { isMobile } = useDeviceType()

    const goToSvgIcon = () => {
        navigate('/svgicon')
    }

    const goToMobileGuide = () => {
        if (!isMobile) {
            Modal.warning({
                title: '提示',
                content: (<div>若您处于PC端<br/>请从<span className='text-[#1677ff]'>浏览器开发者工具</span>进入移动端<br/>以完善体验</div>),
                onOk: () => {
                    navigate('/mobile')
                },
            })
            return
        }
        navigate('/mobile')
    }

    const goToDeveloping = () => {
        navigate('/developing')
    }

    return (
        <div className='w-full'>
            <h1 className='w-full py-[100px] text-[4rem] text-center font-bold'>Welcome</h1>

            <div className='flex justify-center w-full'>
                <ul role='list' className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 max-w-full px-10 text-[3rem] text-center'>
                    <li className='h-[400px] p-10 rounded-[16px] [box-shadow:var(--box-shadow)] hover:bg-[var(--item-bg-hover)]'>
                        <button type='button' className='w-full h-full' onClick={() => goToSvgIcon()}>svg</button>
                    </li>
                    <li className='h-[400px] p-10 rounded-[16px] [box-shadow:var(--box-shadow)] hover:bg-[var(--item-bg-hover)]'>
                        <button type='button' className='w-full h-full' onClick={() => goToMobileGuide()}>移动端<br/>工具</button>
                    </li>
                    <li className='h-[400px] p-10 rounded-[16px] [box-shadow:var(--box-shadow)] hover:bg-[var(--item-bg-hover)]'>
                        <button type='button' className='w-full h-full' onClick={() => goToDeveloping()}>developing</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Introduce
