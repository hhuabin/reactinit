/**
 * base64编码
 * @param str 需要编码的字符串
 * @returns 编码后的字符串
 */
export const base64Encode = (str: string): string => {
    const utf8Bytes = new TextEncoder().encode(str)
    const binaryStr = Array.from(utf8Bytes)
        .map(byte => String.fromCharCode(byte))
        .join('')
    return btoa(binaryStr)
}

/**
 * base64解码
 * @param base64 需要解码的字符串
 * @returns 解码后的字符串
 */
export const base64Decode = (base64: string): string => {
    const binaryStr = atob(base64)
    const bytes = Uint8Array.from(binaryStr, char => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}
