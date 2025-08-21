export type UploadFile = {
    url?: string;                               // 文件地址
    tempUrl?: string;                           // 临时文件地址，base64 或者 string
    key?: React.Key;                            // 文件唯一标识符，未指定则默认生成
    status?: 'done' | 'uploading' | 'failed' | '';      // 上传状态
    name?: string;                              // 文件名，非图片类型文件时显示
    message?: string;                           // 上传失败 | 上传中时展示
    percent?: number;                           // 上传进度，非 0 时展示进度条
    file?: File;                                // 文件对象
}

export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    headers?: Record<string, string>;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;      // 响应数据类型，默认是 text
    data?: {[key: string]: string | Blob};          // file 之外的请求参数
    maxConcurrent?: number;                         // 最大并发上传个数
}

export type UploaderBeforeRead = (files: File[]) => boolean | Promise<boolean | File[]>;
export type UploaderAfterRead = (files: UploadFile[]) => void;
export type UploaderBeforeDelete = (items: UploadFile, index: number) => boolean | Promise<boolean>;
