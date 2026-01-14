/**
 * @Author: bin
 * @Date: 2026-01-13 16:32:26
 * @LastEditors: bin
 * @LastEditTime: 2026-01-14 16:47:42
 */
import ImagePreview from './ImagePreview'
import { renderImperatively } from './utils/renderImperatively'
import { type ImagePreviewOptions } from './ImagePreview.d'

export type ImagePreviewShowHandler = {
    close: () => void
}

const handlerSet = new Set<ImagePreviewShowHandler>()

const clearImagePreview = () => {
    handlerSet.forEach(handler => {
        handler.close()
    })
    handlerSet.clear()
}

/**
 * @description 显示图片预览
 * @param {ImagePreviewOptions} options
 * @return {ImagePreviewShowHandler} 关闭函数
 */
export const showImagePreview = (options: ImagePreviewOptions): ImagePreviewShowHandler => {
    clearImagePreview()
    const handler: ImagePreviewShowHandler = renderImperatively(
        <ImagePreview
            {...options}
            afterClose={() => {
                // 在关闭时删除 handler
                handlerSet.delete(handler)
                options.afterClose?.()
            }}
        />,
    )
    handlerSet.add(handler)
    return handler
}
