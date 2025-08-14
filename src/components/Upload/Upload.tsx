import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'

import './Upload.less'

export type UploadFile = {
    url: string;
    status?: 'done' | 'uploading' | 'failed';
    name?: string;                    // 文件名，非图片类型文件时显示
    message?: string;                 // 上传失败 | 上传中时展示
    percent?: number;                 // 上传进度，非 0 时展示进度条
}

type Props = {
    fileList?: UploadFile[];          // 已上传的文件列表
    accept?: string;                  // 允许上传的文件类型
    maxCount?: number;                // 文件上传数量限制
    multiple?: boolean;                // 是否支持多选文件
    maxSize?: number;                 // 文件大小限制，单位为 byte
    disabled?: boolean;               // 是否禁用文件上传
    children?: JSX.Element;           // 自定义 Upload children
    beforeRead?: () => void;
    afterRead?: () => void;
    beforeDelete?: () => void;
}

export type UploadRef = {
    chooseFile: VoidFunction;
}

const Upload = forwardRef((props: Props, ref: ForwardedRef<UploadRef>) => {
    const {
        fileList = [],
        accept = 'image/*',
        maxCount = Number.MAX_VALUE,
        multiple = false,
        maxSize = 0,
        disabled = false,
        children,
        beforeRead,
        afterRead,
        beforeDelete,
    } = props

    const [dragActive, setDragActive] = useState(false)   // 拖拽状态，是否进入了 input
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleDragEvents = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === 'dragover') {
                e.dataTransfer && (e.dataTransfer.dropEffect = 'none')
            }
        }

        document.addEventListener('dragover', handleDragEvents)
        document.addEventListener('drop', handleDragEvents)

        return () => {
            document.removeEventListener('dragover', handleDragEvents)
            document.removeEventListener('drop', handleDragEvents)
        }
    })

    /**
     * @description 拖拽事件处理函数
     * @param { React.DragEvent<HTMLInputElement> } event 事件对象
     */
    const handleDrag = (event: React.DragEvent<HTMLInputElement>) => {
        event.preventDefault()     // 阻止事件的默认行为
        event.stopPropagation()    // 防止事件冒泡到可能包含的其他拖拽监听器
        if (event.type === 'dragenter' || event.type === 'dragover') {
            event.dataTransfer.dropEffect = 'copy'
            setDragActive(true)
        } else if (event.type === 'dragleave') {
            setDragActive(false)
        }
    }

    /**
     * @description 拖拽事件处理函数
     * @param { React.DragEvent<HTMLInputElement> } event 事件对象
     */
    const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
        event.preventDefault()
        setDragActive(false)
        const { files } = event.dataTransfer
        console.log(files)
        if (!!files.length) return

    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target
        console.log(files)
        if (!files || !!files.length) return

        // ✅ 清空 input 的 value，防止相同文件不触发 onChange
        event.target.value = ''
    }

    const onDelete = (index: number) => {

    }

    /**
     * @description 选择文件
     */
    const chooseFile = () => {
        if (!disabled) return
        inputRef.current?.click()
    }

    const isImage = (uploadFile: UploadFile): boolean => {
        const { url } = uploadFile
        if (url.endsWith('.png')) return true
        return false
    }

    useImperativeHandle(ref, () => ({
        chooseFile,
    }))

    return (
        <div className='bin-upload-wrapper'>
            {(() => {
                const newFileList = fileList.slice(0, maxCount + 1)
                return newFileList.map((uploadFile, index) => (
                    <div className='bin-upload' key={index}>
                        {
                            isImage(uploadFile) ? (
                                // 图片显示
                                <div className='bin-upload-image'>
                                    <img src={uploadFile.url} />
                                </div>
                            ) : (
                                // 文件显示
                                <div className='bin-upload-file'>
                                    <div className='bin-upload-file-icon'>
                                        <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M80 35L55 35L55 10L80 35L80 90L20 90L20 10L55 10' stroke='#b5b7ba' strokeWidth='4'
                                                fill='none' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                    </div>
                                    <div className='bin-upload-file-name'>{ uploadFile.name + '845564856486748789787' }</div>
                                </div>
                            )
                        }

                        {
                            // 上传失败
                            uploadFile.status === 'failed' && (
                                <div className='bin-upload-error'>
                                    <div className='bin-upload-error-icon'>
                                        <svg width='100%' height='100%' viewBox='0 0 100 75' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M3 60L3 3L97 3L97 72L3 72L3 57L20 40L45 60L75 30L100 60' stroke='white' strokeWidth='6'
                                                fill='none' strokeLinecap='round' strokeLinejoin='round' />
                                            <circle cx='25' cy='20' r='6' stroke='white' strokeWidth='5' fill='none' strokeLinecap='round' />
                                        </svg>
                                    </div>
                                    <div className='bin-upload-message'>{ uploadFile.message }</div>
                                </div>
                            )
                        }
                        {
                            // 上传中
                            uploadFile.status === 'uploading' && (
                                <div className='bin-upload-loading'>
                                    {
                                        !uploadFile.percent && (
                                            <div className='bin-upload-loading-icon'>
                                                <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                                    <defs>
                                                        <linearGradient id='blackGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                                            <stop offset='0%' stopColor='white' stopOpacity='1' />
                                                            <stop offset='100%' stopColor='white' stopOpacity='0' />
                                                        </linearGradient>
                                                    </defs>
                                                    <circle className='bin-svg-rotate-spinner' cx='50' cy='50' r='36' stroke='url(#blackGradient)'
                                                        strokeWidth='8' fill='none' strokeDasharray='141.5 141.5' strokeLinecap='round' />
                                                </svg>
                                            </div>
                                        )
                                    }
                                    <div className='bin-upload-message'>{ uploadFile.message }</div>
                                    {
                                        !!uploadFile.percent && (
                                            <div className='bin-upload-progress-wrapper'>
                                                <div className='bin-upload-progress' style={{ transform: `translateX(${Math.min(Math.max(Number(uploadFile.percent) - 100, -100), 0)}%)` }}></div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }

                        {/* 删除按钮 */}
                        <button
                            className='bin-upload-delete-icon'
                            onClick={() => onDelete(index)}
                        >
                            <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                <line x1='40' y1='30' x2='70' y2='60' stroke='white' strokeWidth='6' strokeLinecap='round' />
                                <line x1='70' y1='30' x2='40' y2='60' stroke='white' strokeWidth='6' strokeLinecap='round' />
                            </svg>
                        </button>
                    </div>
                ))
            })()}
            {(fileList.length < maxCount) && (
                <div className='bin-upload'>
                    {
                        children || (
                            <div
                                className='bin-upload-add-icon'
                                style={{ backgroundColor: dragActive ? '#e6f2ff' : '' }}
                            >
                                <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                                    <line x1='50' y1='35' x2='50' y2='65' stroke='#dcdee0' strokeWidth='2' strokeLinecap='round' />
                                    <line x1='35' y1='50' x2='65' y2='50' stroke='#dcdee0' strokeWidth='2' strokeLinecap='round' />
                                </svg>
                            </div>
                        )
                    }
                    <input
                        ref={inputRef}
                        className='bin-upload-input'
                        type='file'
                        disabled={disabled}
                        accept={accept}
                        onChange={(event) => onFileChange(event)}
                        onDragEnter={(event) => handleDrag(event)}
                        onDragLeave={(event) => handleDrag(event)}
                        onDragOver={(event) => handleDrag(event)}
                        onDrop={(event) => handleDrop(event)}
                    ></input>
                    {/*
                        onDragEnter: 拖拽进入
                        onDragLeave: 拖拽离开
                        onDragOver: 拖拽悬停时 不断 触发，必须阻止默认行为才能让drop事件生效
                        onDrop: 放置时触发，必须阻止默认行为才能阻止文件打开
                        */}
                </div>
            )}
        </div>
    )
})

export default Upload
