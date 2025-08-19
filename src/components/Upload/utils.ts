import type { UploadFile } from './Upload.d'

/**
 * @description 根根据文件判定是不是图片文件
 * @param { UploadFile } uploadFile
 * @returns { boolean }
 */
export const isImageFile = (uploadFile: UploadFile): boolean => {
    const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i
    if (uploadFile.file?.type) {
        return uploadFile.file.type.indexOf('image/') === 0
    }

    const url = uploadFile.tempUrl || uploadFile.url || ''
    const base64 = url.indexOf('data:image') === 0
    const isImageUrl = IMAGE_REGEXP.test(url)
    return base64 || isImageUrl
}

/**
 * @description 当文件是图片时，返回图片的 base64，非图片返回预览地址
 * @param { File } file 文件对象
 * @returns { string }
 */
export const readFileContent = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        if (file.type.indexOf('image/') === 0) {
            // 图片类型读取文件
            const reader = new FileReader()
            reader.onload = (event) => {
                resolve((event.target as FileReader).result as string)
            }
            reader.readAsDataURL(file)
        } else {
            // 非图片类型，创建临时 URL
            resolve(URL.createObjectURL(file))
        }
    })
}
