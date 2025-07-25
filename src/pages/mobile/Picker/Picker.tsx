import { useState } from 'react'

import MobilePicker from '@/components/mobile/MobilePicker'
import type { PickerConfirmEventParams } from '@/components/mobile/MobilePicker'

const pickerColumns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const Picker: React.FC = () => {

    const [pickerValue, setPickerValue] = useState('')
    const [pickerVisible, setPickerVisible] = useState(false)

    const changePickerVisible = () => {
        setPickerVisible(!pickerVisible)
    }

    const handleConfirmPicker = ({ selectOption }: PickerConfirmEventParams) => {
        setPickerValue(selectOption as string)
        setPickerVisible(false)
    }

    return (
        <>
            <div className='w-full min-h-screen bg-[var(--color-bg-layout)]'>
                <ul role='list' className='w-full bg-[var(--color-bg-container)] text-[var(--color-text)] text-[2rem] leading-10'>

                    <li className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[45rem]
                        after:h-px after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => changePickerVisible()}
                        >
                            <div className='flex-none min-w-40 mr-[5.5rem]'>Picker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full break-all'>{ pickerValue || '请选择' }</div>
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
            <MobilePicker
                visible={pickerVisible}
                columns={pickerColumns}
                onConfirm={handleConfirmPicker}
                onCancel={() => setPickerVisible(false)}
            ></MobilePicker>
        </>
    )
}

export default Picker
