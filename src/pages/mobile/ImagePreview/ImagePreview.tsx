/**
 * @Author: bin
 * @Date: 2025-12-25 15:32:17
 * @LastEditors: bin
 * @LastEditTime: 2025-12-25 16:49:40
 */
import { useState, useEffect } from 'react'

import ImagePreview from '@/components/mobile/ImagePreview'

const ImagePreviewComponent: React.FC = () => {

    const [visible, setVisible] = useState(false)

    const demoViewImages = [
        'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
        'https://images.unsplash.com/photo-1601128533718-374ffcca299b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3128&q=80',
        'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3113&q=80',
        'https://images.unsplash.com/photo-1624993590528-4ee743c9896e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=1000&q=80',
    ]

    return (
        <>
            <div className='w-full my-10'>
                <div className='w-full p-4 text-[16px] leading-[24px]'>基础用法</div>
                <div className='w-full px-4'>
                    <button
                        type='button'
                        className='px-[16px] border border-[var(--color-border)] rounded-md m-2 text-[16px] bg-[var(--bg-color)] select-none
                            text-[var(--color-text)] leading-[32px] hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]'
                        onClick={() => setVisible(true)}
                    >
                        <span>showImagePreview</span>
                    </button>
                </div>
            </div>

            <ImagePreview
                visible={visible}
                images={demoViewImages}
                onClose={() => {
                    setVisible(false)
                }}
            ></ImagePreview>
        </>
    )
}

export default ImagePreviewComponent
