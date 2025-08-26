# 使用说明

```tsx
// 直接引入使用，不传任何参数亦可
<Upload></Upload>
```



## 参数

| 参数           | 说明                                                         | 类型                           | 默认值             |
| :------------- | :----------------------------------------------------------- | :----------------------------- | :----------------- |
| `fileList`     | 已上传的文件列表                                             | `UploadFile[]`                 | -                  |
| `accept`       | 允许上传的文件类型                                           | `string`                       | `'image/*'`        |
| `maxCount`     | 文件上传数量限制，向前截断                                   | `number`                       | `Number.MAX_VALUE` |
| `multiple`     | 是否支持多选文件                                             | `boolean`                      | `false`            |
| `maxSize`      | 文件大小限制，单位为 byte                                    | `number`                       | `Number.MAX_VALUE` |
| `imageFit`     | 图片填充模式                                                 | `'contain' | 'cover' | 'fill'` | `'contain'`        |
| `drag`         | 是否开启拖拽上传                                             | `boolean`                      | `true`             |
| `capture`      | 拍照方式（移动端生效）                                       | `'environment' | 'user'`       | -                  |
| `disabled`     | 是否禁用文件上传                                             | `boolean`                      | `false`            |
| `action`       | 上传的请求配置                                               | `RequestOptions`               | `{}`               |
| `children`     | 自定义 Upload children                                       | `JSX.Element`                  | -                  |
| `onChange`     | 上传文件改变时的回调，上传每个阶段都会触发该事件             | `(info: UploadFile[]) => void` | -                  |
| `beforeRead`   | 读取文件之前的回调，返回 `false | resolve(false) | reject()`，则停止上传 | `UploaderBeforeRead`           | -                  |
| `afterRead`    | 文件读取完成后的回调                                         | `UploaderAfterRead`            | -                  |
| `beforeDelete` | 删除文件之前的回调，返回 `false | resolve(false) | reject()`，则停止上传 | `UploaderBeforeDelete`         | -                  |

**`UploadFile`**

| 参数       | 说明                                 | 类型                                | 默认值 |
| :--------- | :----------------------------------- | :---------------------------------- | :----- |
| `url`      | 文件地址                             | `string`                            | -      |
| `tempUrl`  | 临时文件地址，`base64` 或者 `string` | `string`                            | -      |
| `key`      | 文件唯一标识符，未指定则默认生成     | `React.Key`                         | -      |
| `status`   | 上传状态                             | `'done' |'uploading' |'failed' |''` | -      |
| `name`     | 文件名，非图片类型文件时显示         | `string`                            | -      |
| `message`  | 上传失败 \| 上传中时展示             | `string`                            | -      |
| `percent`  | 上传进度，非 0 时展示进度条          | `number`                            | -      |
| `file`     | 文件对象                             | `File`                              | -      |
| `response` | 上传完成后，服务端响应内容           | `any`                               | -      |

**`RequestOptions`**

| 参数            | 说明                     | 类型                                                         | 默认值   |
| :-------------- | :----------------------- | :----------------------------------------------------------- | :------- |
| `url`           | 上传服务器地址           | `string`                                                     | -        |
| `method`        | 上传请求的 `http method` | `'GET' |'POST' |'PUT' |'DELETE' |'PATCH' |'HEAD' |'OPTIONS'` | `'post'` |
| `headers`       | 设置上传的请求头部       | `Record<string, string>`                                     | -        |
| `timeout`       | 请求过期时间             | `number`                                                     | `0`      |
| `responseType`  | 响应数据类型             | `XMLHttpRequestResponseType`                                 | ` text`  |
| `data`          | ` file` 之外的请求参数   | `{[key: string]: string |Blob}`                              | -        |
| `maxConcurrent` | 最大并发上传个数         | `number`                                                     | `5`      |