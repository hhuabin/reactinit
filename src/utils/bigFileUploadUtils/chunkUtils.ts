/**
 * @description chunkUtils基本原理：对大文件进行切片，并且计算分片的哈希
 * 该工具函数不计算整个文件的哈希，如有需要请查看 singleFileHash
 */
import { mergeSort } from '@/utils/functionUtils/sortUtils'
import createChunk from './worker.js'
import type { FileChunk } from './worker.d'

/**
 * 文件分片配置选项
 */
interface FileChunkOptions {
    chunkSize?: number;         // 分片大小，单位字节，默认 5MB
    maxFileSize?: number;       // 最大文件大小，为 0 时不限制，默认为 0
}

const CHUNK_SIZE = 5 * 1024 * 1024             // 5MB
const THREAD_COUNT = window.navigator.hardwareConcurrency || 4      // 默认并发数为当前计算机内核数量

/**
 * @description 单线程文件切片，建议20M以下文件使用
 * 当文件较小，建议使用单线程切片，多线程需要新开线程以及
 * @param { File } file 文件源对象
 * @param { FileChunkOptions } options 选项配置
 * @returns { FileChunk[] } 切片结果
 */
export const singleThreadCreateFileChunks = async (file: File, options: FileChunkOptions = {}) => {
    const { maxFileSize = 0, chunkSize = CHUNK_SIZE } = options
    if (maxFileSize !== 0 && file.size > maxFileSize) {
        throw new Error(`最大文件大小为 ${maxFileSize / 1024 / 1024} M，请重新选择文件`)
    }

    const chunkCount = Math.ceil(file.size / chunkSize)
    const chunkResult: FileChunk[] = []

    console.time('singleThreadCreateFileChunks')
    console.log('正在读取文件...')
    console.log(`开启单线程切片，切片数量为：${chunkCount}`)

    for (let i = 0; i < chunkCount; i++) {
        chunkResult[i] = await createChunk(file, i, chunkSize, chunkCount)
    }
    console.timeEnd('singleThreadCreateFileChunks')

    return chunkResult
}

/**
 * @description 多线程文件切片，20M 以下的文件默认使用单线程分片
 * 重复选择一个文件不触发 input 的 onChange 事件，可以使用 event.target.value = '' 突破浏览器限制
 * @param { File } file 文件源对象
 * @param { FileChunkOptions } options 选项配置
 * @returns { FileChunk[] } 切片结果
 */
export const multiThreadCreateFileChunks = async (file: File, options: FileChunkOptions = {}) => {
    return new Promise<FileChunk[]>((resolve, reject) => {
        const { maxFileSize = 0, chunkSize = CHUNK_SIZE } = options
        if (maxFileSize !== 0 && file.size > maxFileSize) {
            reject(`最大文件大小为 ${maxFileSize / 1024 / 1024} M，请重新选择文件`)
            return
        } else if (file.size < 20 * 1024 * 1024) {
            // 小于 20M 的文件使用单线程分片上传
            resolve(singleThreadCreateFileChunks(file, options))
            return
        }
        // 计算分片数量
        const chunkCount = Math.ceil(file.size / chunkSize)
        // 分配给每个线程分片数量
        const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
        const threadChunks: FileChunk[][] = []
        let finishedCount = 0      // 完成的线程数量
        console.time('multiThreadCreateFileChunks')
        console.log('正在读取文件...')
        console.log(`开启多线程切片，切片数量为：${chunkCount}`)

        for (let i = 0; i < THREAD_COUNT; i++) {
            // 开启一个线程任务，计算分片的哈希值，注意引入的文件路径
            // const worker = new Worker('./worker.js', { type: 'module' })
            const worker = new Worker(new URL('./worker.js', import.meta.url).pathname, { type: 'module' })
            const start = i * threadChunkCount     // 分配给线程的分片开始索引
            const end = Math.min(start + threadChunkCount, chunkCount)  // 分配给线程的分片结束索引

            // 给线程分配任务
            worker.postMessage({
                file,
                start,
                end,
                chunkSize,
                chunkCount,
            })
            // 监听线程返回结果
            worker.onmessage = (e) => {
                worker.terminate()
                finishedCount++
                threadChunks[i] = e.data as FileChunk[]     // 此时的 threadChunks 是一个二维数组
                if (finishedCount >= THREAD_COUNT) {
                    console.timeEnd('multiThreadCreateFileChunks')
                    resolve(threadChunks.flat())
                }
            }
        }
    })
}

/**
 * @description 合并文件分片，用于回显图片
 * @param { FileChunk[] } fileChunks 文件块
 * @returns 合并后的文件
 */
export const mergeFileChunks = (
    fileChunks: FileChunk[],
): Blob => {
    mergeSort(fileChunks, ({ index: a }, { index: b }) => a - b)
    const array = fileChunks.map(item => item.chunk)
    return new Blob(array)
}

/**
 * @description 预览图片
 * @param { File } file 图片文件
 */
export const previewImage = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            reject('请选择图片文件')
            return
        } else if (file.type.indexOf('image') === -1) {
            reject('请选择图片文件')
            return
        } else if (file.size > 50 * 1024 * 1024) {
            reject('图片大小不能超过50M')
            return
        }
        // 此处会加载整个文件，太大的就不要放进来了
        const reader = new FileReader()
        reader.onload = (e) => {
            resolve(e.target?.result as string)
        }
        reader.onerror = () => {
            console.error('图片读取失败')
        }
        reader.readAsDataURL(file)
    })
}


/* const getFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('file', file)

    if (!file) return
    // 回显源图片
    // previewImage(file)
    multiThreadCreateFileChunks(file)
    .then(res => {
        console.log(res)
        const result = mergeFileChunks(res)
        // 回显切片后的图片
        // previewSliceImage(result)
    })
    .catch(err => {
        console.error('切片失败', err)
    })
    .finally(() => {
        // ✅ 清空 input 的 value，防止相同文件不触发 onChange，清空value也会导致input默认显示为未选择任何文件
        event.target.value = ''
    })
} */
