import { useState, useEffect } from 'react'

import { SinglePicker } from '@/components/mobile/Picker'
import Picker from '@/components/mobile/Picker'
import type { PickerOption as SinglePickerOption, PickerConfirmEventParams as SinglePickerConfirmEventParams } from '@/components/mobile/Picker/SinglePicker'
import type { PickerOption, PickerColumn, PickerConfirmEventParams } from '@/components/mobile/Picker'

import {
    singlePickerColumns1,
    singlePickerColumns2,
    pickerColumns11,
    pickerColumns12,
    pickerColumns21,
    pickerColumns22,
    pickerColumns31,
    pickerColumns32,
} from './columns'

const PickerComponent: React.FC = () => {

    const [singlePickerValue, setSinglePickerValue] = useState('')
    const [singlePickerVisible, setSinglePickerVisible] = useState(false)

    const [pickerValue1, setPickerValue1] = useState('')
    const [pickerVisible1, setPickerVisible1] = useState(false)
    const [pickerColumns1, setPickerColumns1] = useState(pickerColumns11)

    const [pickerValue2, setPickerValue2] = useState('')
    const [pickerVisible2, setPickerVisible2] = useState(false)
    const [pickerColumns2, setPickerColumns2] = useState(pickerColumns21)

    const [pickerValue3, setPickerValue3] = useState('')
    const [pickerVisible3, setPickerVisible3] = useState(false)
    const [pickerColumns3, setPickerColumns3] = useState(pickerColumns31)

    const changeSinglePickerVisible = () => {
        setSinglePickerVisible(!singlePickerVisible)
    }
    const handleConfirmSinglePicker = ({ selectOption, selectValue }: SinglePickerConfirmEventParams) => {
        console.log('selectOption', selectOption)
        setSinglePickerValue(selectOption.value as string)
    }

    const changePickerVisible1 = () => {
        setPickerVisible1(!pickerVisible1)
    }
    const handleConfirmPicker1 = ({ selectedIndexs, selectedOptions, selectedValues }: PickerConfirmEventParams) => {
        console.log('selectedOptions', selectedIndexs, selectedOptions, selectedValues)
        const selectedValue = selectedValues.join(', ')
        setPickerValue1(selectedValue)
    }
    const changePickerColumns1 = () => {
        setPickerColumns1(pickerColumns12)
    }

    const changePickerVisible2 = () => {
        setPickerVisible2(!pickerVisible2)
    }
    const handleConfirmPicker2 = ({ selectedIndexs, selectedOptions, selectedValues }: PickerConfirmEventParams) => {
        console.log('selectedOptions', selectedIndexs, selectedOptions, selectedValues)
        const selectedValue = selectedValues.join(', ')
        setPickerValue2(selectedValue)
    }
    const changePickerColumns2 = () => {
        setPickerColumns2(pickerColumns22)
    }

    const changePickerVisible3 = () => {
        setPickerVisible3(!pickerVisible3)
    }
    const handleConfirmPicker3 = ({ selectedIndexs, selectedOptions, selectedValues }: PickerConfirmEventParams) => {
        console.log('selectedOptions', selectedIndexs, selectedOptions, selectedValues)
        const selectedValue = selectedValues.join(', ')
        setPickerValue3(selectedValue)
    }
    const changePickerColumns3 = () => {
        setPickerColumns3(pickerColumns32)
    }

    useEffect(() => {
        setTimeout(() => {
            changePickerColumns3()
        }, 3000)
    }, [])

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
                            onClick={() => changeSinglePickerVisible()}
                        >
                            <div className='flex-none min-w-64 mr-10'>MobilePicker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>{ singlePickerValue || '单列选择器' }</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>

                    <li
                        className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[45rem]
                            after:h-px after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => changePickerVisible1()}
                        >
                            <div className='flex-none min-w-64 mr-10'>Picker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>{ pickerValue1 || '单列选择器' }</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>

                    <li
                        className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[45rem]
                            after:h-px after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => changePickerVisible2()}
                        >
                            <div className='flex-none min-w-64 mr-10'>Picker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>{ pickerValue2 || '多列选择器' }</div>
                                <div className='flex-none w-8 h-8 ml-[0.75rem]'>
                                    <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                        <polyline points='35,20 65,50 35,80' fill='none' stroke='var(--color-fill)' strokeWidth='8' strokeLinecap='round'>
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </li>

                    <li
                        className='relative w-full after:content-[""] after:absolute after:right-0 after:bottom-0 after:w-[45rem]
                            after:h-px after:bg-[var(--color-border-bg)] after:scale-y-50 last:after:hidden hover:bg-[var(--color-container-hover)]'
                    >
                        <button
                            type='button'
                            className='flex justify-between w-full min-h-[5.5rem] py-6 px-unit30 box-border text-left overflow-hidden active:bg-[var(--item-bg-active)]'
                            onClick={() => changePickerVisible3()}
                        >
                            <div className='flex-none min-w-64 mr-10'>Picker</div>
                            <div className='flex justify-between items-center w-full min-h-10 text-[var(--color-text)]'
                            >
                                <div className='w-full h-full text-[#999] break-all'>{ pickerValue3 || '级联选择器' }</div>
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

                <div className='flex w-full justify-center my-8'>
                    <button
                        type='button'
                        className='px-4 border border-[var(--color-border)] rounded-md text-[16px] bg-[var(--bg-color)] select-none
                            text-[var(--color-text)] leading-[24px] hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                        onClick={() => changePickerColumns1()}
                    >
                        <span>点击改变单列数据</span>
                    </button>
                    <button
                        type='button'
                        className='px-4 border border-[var(--color-border)] rounded-md text-[16px] bg-[var(--bg-color)] select-none
                            text-[var(--color-text)] leading-[24px] hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                        onClick={() => changePickerColumns2()}
                    >
                        <span>点击改变多列数据</span>
                    </button>
                    <button
                        type='button'
                        className='px-4 border border-[var(--color-border)] rounded-md text-[16px] bg-[var(--bg-color)] select-none
                            text-[var(--color-text)] leading-[24px] hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                        onClick={() => changePickerColumns3()}
                    >
                        <span>点击改变级联数据</span>
                    </button>
                </div>
            </div>
            <SinglePicker
                visible={singlePickerVisible}
                defaultIndex={2}
                loading={true}
                onChangeVisible={(value) => setSinglePickerVisible(value)}
                columns={singlePickerColumns2}
                onConfirm={handleConfirmSinglePicker}
                onCancel={() => setSinglePickerVisible(false)}
            ></SinglePicker>
            {/* 单列选择器 */}
            <Picker
                visible={pickerVisible1}
                onChangeVisible={(value) => setPickerVisible1(value)}
                defaultIndexs={[2]}
                columns={pickerColumns1}
                onConfirm={handleConfirmPicker1}
                onCancel={() => setPickerVisible1(false)}
            ></Picker>
            {/* 多列选择器 */}
            <Picker
                visible={pickerVisible2}
                onChangeVisible={(value) => setPickerVisible2(value)}
                defaultIndexs={[1, 2]}
                columns={pickerColumns2}
                onConfirm={handleConfirmPicker2}
                onCancel={() => setPickerVisible2(false)}
            ></Picker>
            {/* 级联选择器 */}
            <Picker
                visible={pickerVisible3}
                onChangeVisible={(value) => setPickerVisible3(value)}
                defaultIndexs={[10, 10, 10]}
                columns={pickerColumns3}
                columnsFieldNames={{ label: 'cityName' }}
                onConfirm={handleConfirmPicker3}
                onCancel={() => setPickerVisible3(false)}
            ></Picker>
        </>
    )
}

export default PickerComponent
