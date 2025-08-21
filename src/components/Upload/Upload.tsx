/* eslint-disable max-lines */
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'
import { flushSync } from 'react-dom'

import './Upload.less'

import { isImageFile, readFileContent } from './utils'
import { xhrRequest } from './xhrRequest'
import { runTasksWithLimitSettled } from '@/utils/functionUtils/runTasksWithLimit'
import type { UploadFile, RequestOptions, UploaderBeforeRead, UploaderAfterRead, UploaderBeforeDelete } from './Upload.d'

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
    action?: RequestOptions;                    // 上传的请求配置
    children?: JSX.Element;                     // 自定义 Upload children
    onChange?: React.Dispatch<React.SetStateAction<UploadFile[]>>;    // 上传文件改变时的回调，上传每个阶段都会触发该事件
    beforeRead?: UploaderBeforeRead;            // 读取文件之前的回调，返回 false | resolve(false) | reject()，则停止上传
    afterRead?: UploaderAfterRead;              // 文件读取完成后的回调
    beforeDelete?: UploaderBeforeDelete;        // 删除文件之前的回调，返回 false | resolve(false) | reject()，则停止上传
}

export type UploadRef = {
    chooseFile: VoidFunction;
}

const Upload = forwardRef((props: Props, ref: ForwardedRef<UploadRef>) => {
    const {
        fileList: propFileList,
        accept = 'image/*',
        maxCount = Number.MAX_VALUE,
        multiple = false,
        maxSize = Number.MAX_VALUE,
        drag = true,
        disabled = false,
        action = {} as RequestOptions,
        children,
        onChange,
        beforeRead,
        afterRead,
        beforeDelete,
    } = props

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [dragActive, setDragActive] = useState(false)   // 拖拽状态，是否进入了 input
    const inputRef = useRef<HTMLInputElement>(null)
    const controller = useRef<Map<React.Key, AbortController>>(new Map())

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
        const newFileList = (propFileList || [])
                .slice(0, maxCount)
                .map(file => ({
                    ...file,
                    key: file.key ?? `upload-${Date.now()}-${uploadKeyIndex++}`,
                }))
        setFileList(() => newFileList)
    }, [propFileList])

    /**
     * @description 文件列表改变后更新状态函数
     * @param { UploadFile[]} files 文件改变后的列表
     */
    const changeFile = (state: UploadFile[] | ((prevState: UploadFile[]) => UploadFile[])) => {
        // 当开发者传入 fileList 或 onChange() 方法时，调用开发者传入的方法
        if (propFileList || onChange) {
            props.onChange?.(state)
        } else {
            setFileList(state)
        }
    }

    // ✅ 清空 input 的 value，防止相同文件不触发 onChange
    const resetInput = () => {
        inputRef.current && (inputRef.current.value = '')
    }

    /**
     * @description 上传单个文件
     * @param { UploadFile } uploadFile 上传文件
     * @param { RequestOptions } action xhr请求配置
     */
    const xhrUploadFile = (uploadFile: UploadFile, action: RequestOptions) => {
        const formData = new FormData()
        formData.append('file', uploadFile.file!)
        // 接收自定义参数
        if (action.data) {
            Object.keys(action.data).forEach((key) => {
                formData.append(key, action.data![key])
            })
        }
        // 创建取消请求的 controller
        const newController = new AbortController()
        controller.current.set(uploadFile.key!, newController)

        return xhrRequest({
            url: action.url,
            headers: action.headers || {},
            method: action.method || 'POST',
            signal: newController.signal,
            body: formData,
            responseType: action.responseType || 'text',
            onUploadProgress: (percent) => {
                // 此处闭包，获得的 propFileList 是旧值，因此使用了函数式更新，后续需要更新为非函数是更新
                changeFile(prevList => {
                    const newPercentFileList = prevList.map(_uploadFile => {
                        if (_uploadFile.key === uploadFile.key) {
                            _uploadFile.percent = percent
                        }
                        return _uploadFile
                    })
                    return newPercentFileList
                })
            },
        })
        .then((response) => {
            // 此处闭包，获得的 propFileList 是旧值，因此使用了函数式更新，后续需要更新为非函数是更新
            changeFile(prevList => {
                const newPercentFileList = prevList.map(_uploadFile => {
                    if (_uploadFile.key === uploadFile.key) {
                        _uploadFile.url = response
                        _uploadFile.status = ''
                        _uploadFile.message = ''
                    }
                    return _uploadFile
                })
                return newPercentFileList
            })
        })
        .catch((error) => {
            console.error(error)
            // 此处闭包，获得的 propFileList 是旧值，因此使用了函数式更新，后续需要更新为非函数是更新
            changeFile(prevList => {
                const newPercentFileList = prevList.map(_uploadFile => {
                    if (_uploadFile.key === uploadFile.key) {
                        _uploadFile.status = 'failed'
                        _uploadFile.message = '上传失败'
                    }
                    return _uploadFile
                })
                return newPercentFileList
            })
        })
        .finally(() => {
            // 删除该 controller
            controller.current.delete(uploadFile.key!)
        })
    }

    /**
     * @description 并发上传文件列表
     * @param { UploadFile[] } uploadFileList 文件列表
     */
    const requestUploadingFileList = (uploadFileList: UploadFile[]) => {
        // 创建任务队列
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasks: (() => Promise<any>)[] = []
        // 此处的 propFileList 还是旧的
        console.log('xhrUploadFile', propFileList)

        uploadFileList.forEach((uploadFile, index) => {
            uploadFile.percent = 0
            uploadFile.status = 'uploading'
            uploadFile.message = '上传中...'

            tasks.push(() => xhrUploadFile(uploadFile, action))
        })
        // 更新文件的状态为上传中...
        flushSync(() => {
            changeFile([...fileList, ...uploadFileList])
        })
        // 并发上传所有文件
        runTasksWithLimitSettled(tasks, action.maxConcurrent || 5)
    }

    /**
     * @description 读取文件列表
     * @param { File[] } files 文件列表
     */
    const readFiles = (files: File[]) => {
        // 过滤大小超过限制的文件
        files = files.filter(items => items.size <= maxSize)

        if (files.length > maxCount) {
            files = files.slice(0, maxCount)
        }
        Promise.all(
            files.map((file) => readFileContent(file)),
        )
        .then((tempUrls) => {
            // 生成 uploadFile 列表
            const uploadFiles = files.map((file, index) => {
                return {
                    key: `upload-${Date.now()}-${uploadKeyIndex++}`,
                    tempUrl: tempUrls[index],
                    status: '',
                    name: file.name,
                    file,
                } as UploadFile
            }, [] as UploadFile[])
            flushSync(() => {
                changeFile([...fileList, ...uploadFiles])
            })
            resetInput()
            // 执行自定义传入的读取完成后方法
            afterRead?.(uploadFiles)
            // 若开发者传入了 url，则直接上传文件列表
            if (action.url) {
                requestUploadingFileList(uploadFiles)
            }
        })
        .catch(console.warn)
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
                    readFiles(cloneFileList)
                })
                .catch(resetInput)
                // 此处必须返回，避免下面的 readFiles 重复读取
                return
            }
        }

        readFiles(cloneFileList)
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
                    readFiles(cloneFileList)
                })
                .catch(resetInput)
                // 此处必须返回，避免下面的 readFiles 重复读取
                return
            }
        }

        readFiles(cloneFileList)
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
            controller.current.get(uploadFile.key!)?.abort()
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
