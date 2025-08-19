/* eslint-disable max-lines */
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'

import './Upload.less'

import { isImageFile, readFileContent } from './utils'
import type { UploadFile, UploaderBeforeRead, UploaderAfterRead, UploaderBeforeDelete } from './Upload.d'

let uploadKeyIndex = 0

type Props = {
    fileList?: UploadFile[];                    // 已上传的文件列表
    accept?: string;                            // 允许上传的文件类型，默认值 image/*
    maxCount?: number;                          // 文件上传数量限制，向前截断
    multiple?: boolean;                         // 是否支持多选文件
    maxSize?: number;                           // 文件大小限制，单位为 byte
    drag?: boolean;                             // 是否开启拖拽上传
    capture?: 'environment' | 'user';           // 拍照方式
    disabled?: boolean;                         // 是否禁用文件上传
    children?: JSX.Element;                     // 自定义 Upload children
    onChange?: (info: UploadFile[]) => void;    // 上传文件改变时的回调，上传每个阶段都会触发该事件
    beforeRead?: UploaderBeforeRead;            // 读取文件之前的回调，返回 false | resolve(false) | reject()，则停止上传
    afterRead?: UploaderAfterRead;              // 文件读取完成后的回调
    beforeDelete?: UploaderBeforeDelete;        // 删除文件之前的回调，返回 false | resolve(false) | reject()，则停止上传
}

export type UploadRef = {
    chooseFile: VoidFunction;
}

const Upload = forwardRef((props: Props, ref: ForwardedRef<UploadRef>) => {
    const {
        accept = 'image/*',
        maxCount = Number.MAX_VALUE,
        multiple = false,
        maxSize = Number.MAX_VALUE,
        drag = true,
        disabled = false,
        children,
        beforeRead,
        afterRead,
        beforeDelete,
    } = props

    const [fileList, setFileList] = useState<UploadFile[]>([])

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
    }, [])

    useEffect(() => {
        const newFileList = (props.fileList || [])
                .slice(0, maxCount)
                .map(file => ({
                    ...file,
                    key: file.key ?? `upload-${Date.now()}-${uploadKeyIndex++}`,
                }))
        setFileList(newFileList)
    }, [props.fileList])

    /**
     * @description 文件列表改变后更新状态函数
     * @param { UploadFile[]} files 文件改变后的列表
     */
    const changeFile = (files: UploadFile[]) => {
        if (props.fileList || props.onChange) {
            props.onChange?.(files)
        } else {
            setFileList(files)
        }
    }

    // ✅ 清空 input 的 value，防止相同文件不触发 onChange
    const resetInput = () => {
        inputRef.current && (inputRef.current.value = '')
    }

    /**
     * @description 读取文件列表
     * @param { File[] } files 文件列表
     */
    const readFile = (files: File[]) => {
        // 过滤大小超过限制的文件
        files = files.filter(items => items.size <= maxSize)

        if (files.length > maxCount) {
            files = files.slice(0, maxCount)
        }
        Promise.all(
            files.map((file) => readFileContent(file)),
        )
        .then((tempUrls) => {
            const _fileList = files.map((file, index) => {
                console.log('file', file)
                return {
                    key: `upload-${Date.now()}-${uploadKeyIndex++}`,
                    tempUrl: tempUrls[index],
                    status: '',
                    name: file.name,
                    file,
                } as UploadFile
            }, [] as UploadFile[])
            changeFile([...fileList, ..._fileList])
            afterRead?.(_fileList)
        })
        .finally(resetInput)
    }

    /**
     * @description 文件发生变化时执行该函数
     */
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target
        if (!files || !files.length) return

        let cloneFileList = Array.from(files)

        /**
         * @description 用户定义了前置函数，需要处理；返回 false 或 reject 状态的 Promise，则取消本次读取
         */
        if (beforeRead) {
            const response = beforeRead(cloneFileList)
            if (response === false) {
                resetInput()
                return
            } else if (
                response !== null &&
                typeof response === 'object' &&
                typeof response.then === 'function' &&
                typeof response.catch === 'function'
            ) {
                response.then(result => {
                    if (typeof result === 'boolean') {
                        if (result === false) return Promise.reject(false)
                    } else {
                        cloneFileList = result
                    }
                    readFile(cloneFileList)
                })
                .catch(resetInput)
                // 此处必须返回，避免下面的 readFile 重复读取
                return
            }
        }

        readFile(cloneFileList)
    }

    /**
     * @description 拖拽事件处理函数
     * @param { React.DragEvent<HTMLInputElement> } event 事件对象
     */
    const handleDrag = (event: React.DragEvent<HTMLInputElement>) => {
        if (!drag) return
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
        if (!files.length) return

        let cloneFileList = Array.from(files)

        /**
         * @description 用户定义了前置函数，需要处理；返回 false 或 reject 状态的 Promise，则取消本次读取
         */
        if (beforeRead) {
            const response = beforeRead(cloneFileList)
            if (response === false) {
                resetInput()
                return
            } else if (
                response !== null &&
                typeof response === 'object' &&
                typeof response.then === 'function' &&
                typeof response.catch === 'function'
            ) {
                response.then(result => {
                    if (typeof result === 'boolean') {
                        if (result === false) return Promise.reject(false)
                    } else {
                        cloneFileList = result
                    }
                    readFile(cloneFileList)
                })
                .catch(resetInput)
                // 此处必须返回，避免下面的 readFile 重复读取
                return
            }
        }

        readFile(cloneFileList)
    }

    /**
     * @description 删除文件
     * @param { UploadFile } uploadFile 文件对象
     */
    const handleDelete = async (uploadFile: UploadFile, index: number) => {
        try {
            const result = await beforeDelete?.(uploadFile, index)
            if (result === false) return
            const _fileList = fileList.filter(item => item.key !== uploadFile.key)
            changeFile(_fileList)
        } catch (error) {
            console.warn(error)
        }
    }

    /**
     * @description 选择文件
     */
    const chooseFile = () => {
        if (!disabled) return
        inputRef.current?.click()
    }

    useImperativeHandle(ref, () => ({
        chooseFile,
    }))

    return (
        <div className='bin-upload-wrapper'>
            {fileList.map((uploadFile, index) => (
                <div className='bin-upload' key={uploadFile.key}>
                    {
                        isImageFile(uploadFile) ? (
                            // 图片显示
                            <div className='bin-upload-image'>
                                <img src={uploadFile.tempUrl || uploadFile.url} />
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
                                <div className='bin-upload-file-name'>{ uploadFile.name || uploadFile.tempUrl || uploadFile.url || '' }</div>
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
                        onClick={() => handleDelete(uploadFile, index)}
                    >
                        <svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                            <line x1='40' y1='30' x2='70' y2='60' stroke='white' strokeWidth='6' strokeLinecap='round' />
                            <line x1='70' y1='30' x2='40' y2='60' stroke='white' strokeWidth='6' strokeLinecap='round' />
                        </svg>
                    </button>
                </div>
            ))}
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
                        { ...(props.capture ? { capture: props.capture } : {}) }
                        { ...(multiple ? { multiple } : {}) }
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
