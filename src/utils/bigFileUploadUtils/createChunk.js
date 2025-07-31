/**
 * @description: 分片上传
 * @param { File } file 文件源对象
 * @param { number } index 分片索引
 * @param { number } chunkSize 分片大小
 * @param { number } chunkCount 分片总体数量
 * @returns { Promise<FileChunk> } 文件分片对象
 */
const createChunk = (file, index, chunkSize, chunkCount) => {
    return new Promise((resolve, reject) => {
        const start = index * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const blob = file.slice(start, end)    // 调用 Blod 的 slice() 方法，返回 Blod 二进制数据

        const reader = new FileReader()
        reader.onload = async (e) => {
            // 计算该分片的哈希值
            const buffer = e.target.result
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
            // 返回结果
            resolve({
                chunkCount,
                fileName: file.name,
                start,
                end,
                index,
                chunk: blob,        // 注意，当前格式是 Blod
                hash: hashHex,
            })
        }
        reader.readAsArrayBuffer(blob)
    })
}

export default createChunk
