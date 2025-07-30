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
                <div className='w-full'>请选择文件（支持任意文件类型）</div>
                <input type='file' onChange={(event) => getFile(event)} />
            </div>

            <div className='w-full'>
                <div className='w-full'>
                    <div className='w-full'>选择文件后回显图片</div>

                    <img src={imgFile} alt="" />
                </div>
                <div className='w-full'>
                    <div className='w-full'>切片后回显的图片</div>

                    <img src={sliceImgFile} alt="" />
                </div>
            </div>
        </div>
    )
}

export default BigFileUpload
