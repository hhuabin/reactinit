// 单个文件分片结果
export interface FileChunk {
    fileName: string;        // 文件名
    fileSize: number;        // 文件总大小
    chunk: Blob;             // 分片内容，二进制 Blod 格式
    hash: string;            // 文件哈希值
    chunkCount: number;      // 全部分片的数量
    index: number;           // 分片索引
    start: number;           // 分片开始位置
    end: number;             // 分片结束位置（不包含）
}

/**
 * @description创建文件分片
 * @param { File } file 文件源对象
 * @param { number } index 文件块索引
 * @param { number } chunkSize 文件块大小
 * @param { number } chunkCount 文件块数量
 * @returns { Promise<FileChunk> } 文件块对象
 */
const createChunk: (file: File, index: number, chunkSize: number, chunkCount: number) => Promise<FileChunk>

export default createChunk
