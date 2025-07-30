/**
 * @description 对整个文件分片同时对整个文件做哈希计算
 * 适用于小文件分片上传
 * 若是对整个大文件进行文件哈希计算，比如1G的文件，很容易造成浏览器内存泄漏而导致浏览器崩溃
 * 所以更建议对分片之后的内容进行哈希计算
 * 文件哈希的主要作用:
 * 1. 避免重复上传
 * 2. 在中断后继续上传未完成的分片
 * 3. 防止传输过程中文件损坏
 */
/**
 * 文件分片配置选项
 */
interface FileChunkOptions {
    chunkSize?: number;         // 分片大小，单位字节，默认 5MB
    maxFileSize?: number;       // 最大文件大小，为 0 时不限制，默认为 0
}

/**
 * 文件分片结果
 */
export interface FileChunkResult {
    hash: string;            // 文件哈希值
    chunks: Blob[];          // 分片列表
    filename: string;        // 文件名
    totalSize: number;       // 文件大小
    chunkCount: number;      // 分片数量
}

const CHUNK_SIZE = 5 * 1024 * 1024             // 5MB

/**
 * @description 计算文件哈希值
 * @param { File } file 文件对象
 * @returns { Promise<string> } 哈希值
 */
async function calculateFileHash(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            const buffer = e.target?.result as ArrayBuffer
            // 计算文件哈希值（摘要）
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
            resolve(hashHex)
        }
        reader.readAsArrayBuffer(file)
    })
}

/**
 * @description 对整个文件切片并进行哈希计算
 * 建议不大于20M的文件使用
 * @param { File } file 文件源对象
 * @param { FileChunkOptions } options 选项配置
 * @returns { FileChunkResult[] } 切片结果
 */
export const createFileChunks = async (file: File, options: FileChunkOptions = {}): Promise<FileChunkResult> => {
    const { maxFileSize = 0, chunkSize = CHUNK_SIZE } = options
    if (maxFileSize !== 0 && file.size > maxFileSize) {
        throw new Error(`最大文件大小为 ${maxFileSize / 1024 / 1024} M，请重新选择文件`)
    }
    const chunkCount = Math.ceil(file.size / chunkSize)
    const chunks: Blob[] = []

    /**
     * 切片
     * file.slice() 只是创建文件引用，不会立即占用内存
     */
    for (let i = 0; i < chunkCount; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        chunks.push(file.slice(start, end))
    }

    /**
     * 计算整个文件的摘要哈希值
     * PS：大文件哈希计算时间过长，会阻塞页面渲染
     */
    const hash = await calculateFileHash(file)

    return {
        hash,
        chunks,
        filename: file.name,
        totalSize: file.size,
        chunkCount,
    }
}

/* createFileChunks(file)
.then(res => {
    console.log('切片成功', res)
})
.catch(err => {
    console.error('切片失败', err)
}) */
