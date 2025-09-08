export * from './chunkUtils'
/**
 * @attention 不能直接导出 `.d.ts` 文件（如 `export * from './createChunk.d'`）
 * 原因：
 * 1. `.d.ts` 是纯类型声明文件，不包含实际代码
 * 2. 若尝试导出 `.d.ts`，TypeScript 会误认为它是一个实际模块
 * 3. 运行时会导致 `undefined` 或 `not defined` 错误（因为无真实导出值）
 * 正确做法：
 * - 从实现文件（`.ts`/`.js`）导出运行时内容
 * - `.d.ts` 会自动被 TypeScript 关联类型
 */
export * from './createChunk'
export * from './upload'
export * from './xhrRequest'
