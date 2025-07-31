import {
    multiThreadCreateFileChunks,
    singleThreadCreateFileChunks,
    mergeFileChunks,
} from './'
import { runTasksWithLimitFailFast } from '@/utils/functionUtils/runTasksWithLimit'
import type { FileChunk } from './createChunk.d'

/**
 * @description 并发上传所有文件分片
 * @param { string } uploadUrl 上传地址
 * @param { FileChunk[] } fileChunks 齐全的文件分片的数组
 * @param { number } limit 上传并发数，默认为 5，不建议上传并发数大于 6。任务失败重发次数默认为 3，需要修改请看代码
 * @returns { Promise<any[]> } 接口的 Promise.all() 结果
 */
export const uploadFileChunks = async (
    uploadUrl: string,
    fileChunks: FileChunk[],
    limit = 5,
) => {
    if (limit > 6) {
        console.warn('不建议上传并发数大于 6')
    }
    const uploadQueue = fileChunks.map(chunk => {
        return () => uploadSingleChunk(uploadUrl, chunk)
    })
    // 并发上传
    return runTasksWithLimitFailFast(uploadQueue, limit, 3)
}

/**
 * @description 上传单个文件分片
 * @param { string } uploadUrl 上传地址
 * @param { FileChunk } fileChunk 单个文件分片对象
 * @returns { Promise<any> } 接口返回什么就填什么，视后端而定
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadSingleChunk = async (uploadUrl: string, fileChunk: FileChunk): Promise<any> => {
    const formData = new FormData()
    formData.append('filename', fileChunk.fileName)
    formData.append('file', fileChunk.chunk)
    formData.append('hash', fileChunk.hash)
    formData.append('chunkCount', fileChunk.chunkCount.toString())
    formData.append('index', fileChunk.index.toString())
    formData.append('start', fileChunk.start.toString())
    formData.append('end', fileChunk.end.toString())

    return fetch(uploadUrl, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: formData,
    })
    .then((response: Response) => {
        if (!response.ok) return Promise.reject(response)
        response.formData()
    })
    .then(data => {
        return data
    })
    .catch(error => {
        return Promise.reject(error)
    })

}

// 选择文件
/* const getFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('file', file)

    if (!file) return
    // 回显图片
    if (file.type.includes('image')) {
        // previewImage(file)
    }
    multiThreadCreateFileChunks(file)
    .then(res => {
        console.log(res)
        const result = mergeFileChunks(res)
        if (file.type.includes('image')) {
            // previewSliceImage(result)
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
} */
