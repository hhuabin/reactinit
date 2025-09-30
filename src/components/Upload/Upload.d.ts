/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UploadFile {
    url?: string;                               // 文件地址
    tempUrl?: string;                           // 临时文件地址，base64 或者 string
    key?: React.Key;                            // 文件唯一标识符，未指定则默认生成
    status?: 'done' | 'uploading' | 'failed' | '';      // 上传状态
    name?: string;                              // 文件名，非图片类型文件时显示
    message?: string;                           // 上传失败 | 上传中时展示
    percent?: number;                           // 上传进度，非 0 时展示进度条
    file?: File;                                // 文件对象
    deletable?: boolean;                        // 是否展示删除按钮，默认展示，'uploading'状态默认不展示
    response?: any;                             // 上传完成后，服务端响应内容
}

export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';  // 默认值是 POST
    headers?: Record<string, string>;
    timeout?: number;                               // 默认是 0
    responseType?: XMLHttpRequestResponseType;      // 响应数据类型，默认是 text
    data?: {[key: string]: string | Blob};          // file 之外的请求参数
    maxConcurrent?: number;                         // 最大并发上传个数
}

export type UploaderBeforeRead = (files: File[]) => boolean | Promise<boolean | File[]>;
/**
 * @description 由于闭包， UploaderAfterRead 函数只能取到旧的文件列表，因此传入一个 fileList 参数，开发者可以参考使用
 * @param newFiles 新文件列表
 * @param fileList 全部文件列表
 */
export type UploaderAfterRead = (newFiles: UploadFile[], fileList: UploadFile[]) => void;
export type UploaderBeforeDelete = (file: UploadFile, index: number) => boolean | Promise<boolean> | void;
