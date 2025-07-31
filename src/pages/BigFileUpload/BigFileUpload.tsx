import { useEffect, useRef, useState } from 'react'

import {
    multiThreadCreateFileChunks,
    singleThreadCreateFileChunks,
    mergeFileChunks,
    uploadFileChunks,
} from '@/utils/bigFileUploadUtils'

const BigFileUpload: React.FC = () => {

    const [imgFile, setImgFile] = useState<string>('#')
    const [sliceImgFile, setSliceImgFile] = useState<string>('#')

    useEffect(() => {

    }, [])

    // 选择文件
    const getFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        console.log('file', file)

        if (!file) return
        // 回显图片
        if (file.type.includes('image')) {
            previewImage(file)
        }
        multiThreadCreateFileChunks(file)
        .then(res => {
            console.log(res)
            const result = mergeFileChunks(res)
            if (file.type.includes('image')) {
                previewSliceImage(result)
            }
            return uploadFileChunks('', res)
        })
        .then(res => {
            console.log('上传成功', res)
        })
        .catch(err => {
            console.error(err)
        })
        .finally(() => {
            // ✅ 清空 input 的 value，防止相同文件不触发 onChange，清空value也会导致input默认显示为未选择任何文件
            event.target.value = ''
        })
    }

    // 回显整个图片
    const previewImage = (file: File) => {
        if (!file) return null
        const reader = new FileReader()

        reader.onload = (e) => {
            setImgFile(e.target?.result as string)
        }

        reader.onerror = () => {
            console.error('图片读取失败')
        }

        reader.readAsDataURL(file)
    }

    const previewSliceImage = (blob: Blob) => {
        console.log('previewSliceImage', blob)

        if (!blob) return null
        const reader = new FileReader()

        reader.onload = (e) => {
            setSliceImgFile(e.target?.result as string)
        }

        reader.onerror = () => {
            console.error('图片读取失败')
        }

        reader.readAsDataURL(blob)
    }

    return (
        <div className='w-full h-full p-4'>
            <div className='w-full'>
                <div
                    className='relative w-[300px] h-16 rounded-sm border border-[var(--color-border)] [box-shadow:var(--box-bottom-shadow)]
                        hover:bg-[var(--item-bg-hover)] cursor-pointer'
                >
                    <input type='file' className='absolute w-full h-full opacity-0 cursor-pointer' onChange={(event) => getFile(event)} />
                    <div className='flex justify-center items-center w-full h-full'>选择文件（支持任意文件类型）</div>
                </div>
            </div>

            <div className='flex w-full mt-4'>
                <div className='w-full'>
                    <div className='w-full p-2 box-border'>图片文件回显：</div>
                    <div className='w-[750px] min-h-64 rounded-sm border border-[var(--color-border)] [box-shadow:var(--box-bottom-shadow)]'>
                        <img src={imgFile} className='w-full h-auto' alt="" />
                    </div>
                </div>
                <div className='w-full'>
                    <div className='w-full p-2 box-border'>切片后回显的图片：</div>
                    <div className='w-[750px] min-h-64 rounded-sm border border-[var(--color-border)] [box-shadow:var(--box-bottom-shadow)]'>
                        <img src={sliceImgFile} className='w-full h-auto' alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BigFileUpload
