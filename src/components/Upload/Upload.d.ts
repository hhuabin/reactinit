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

export type UploaderBeforeRead = (files: File[]) => boolean | Promise<boolean | File[]>;
export type UploaderAfterRead = (files: UploadFile[]) => void;
export type UploaderBeforeDelete = (items: UploadFile, index: number) => boolean | Promise<boolean>;
