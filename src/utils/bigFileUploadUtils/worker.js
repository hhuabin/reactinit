/**
 * @file Worker 线程文件，放线程主代码即可
 * Worker 脚本和普通模块的设计目标不同
 * 如果把 createChunk 函数放进来，然后 export，当 createChunk 被其他文件引入时
 * onmessage 会在主线程执行，而不是在 Worker 中
 * 导致 Worker Start... 不断被打印
 */
import createChunk from './createChunk'

/**
 * @description 线程计算分片 Chunk 对象
 * @param { File } file 整个文件
 * @param { number } index 分片索引
 * @param { number } chunkSize 分片大小
 */
onmessage = async (e) => {
    console.log('Worker Start...')
    const { file, start, end, chunkSize, chunkCount } = e.data
    const promList = []
    for (let i = start; i < end; i++) {
        const prom = createChunk(file, i, chunkSize, chunkCount)
        promList.push(prom)
    }
    // Promise.all() 可以保持顺序
    const chunks = await Promise.all(promList)
    postMessage(chunks)
}
