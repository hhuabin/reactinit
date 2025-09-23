# 使用说明

```tsx
// 直接引入使用，不传任何参数亦可
<Upload></Upload>
```



## 参数

| 参数           | 说明                                                         | 类型                           | 默认值             |
| :------------- | :----------------------------------------------------------- | :----------------------------- | :----------------- |
| `fileList`     | 已上传的文件列表，需要和`onChange`配合使用                   | `UploadFile[]`                 | -                  |
| `accept`       | 允许上传的文件类型，[详细说明](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file#限制允许的文件类型) | `string`                       | `'image/*'`        |
| `maxCount`     | 文件上传数量限制，向前截断                                   | `number`                       | `Number.MAX_VALUE` |
| `multiple`     | 是否支持多选文件                                             | `boolean`                      | `false`            |
| `maxSize`      | 文件大小限制，单位为 byte                                    | `number`                       | `Number.MAX_VALUE` |
| `imageFit`     | 图片填充模式                                                 | `'contain' | 'cover' | 'fill'` | `'contain'`        |
| `drag`         | 是否开启拖拽上传                                             | `boolean`                      | `true`             |
| `capture`      | 拍照方式（移动端生效）                                       | `'environment' | 'user'`       | -                  |
| `disabled`     | 是否禁用文件上传                                             | `boolean`                      | `false`            |
| `action`       | 上传的请求配置                                               | `RequestOptions`               | `{}`               |
| `children`     | 自定义 Upload children                                       | `JSX.Element`                  | -                  |
| `onChange`     | 上传文件改变时的回调，上传每个阶段都会触发该事件，需要和`fileList`配合使用 | `(info: UploadFile[]) => void` | -                  |
| `beforeRead`   | **读取文件之前**的回调，返回`false | resolve(false) | reject()`，则停止读取；<br/>返回 `true | resolve(false)`则上传继续；<br/>切忌不可返回 `pedding` 状态的 `Promise` | `UploaderBeforeRead`           | -                  |
| `afterRead`    | **读取文件完成**后的回调；<br/>可用**函数式更新**将上传状态改成 `'uploading'` | `UploaderAfterRead`            | -                  |
| `beforeDelete` | 删除文件之前的回调，返回 `false | resolve(false) | reject()`，则停止删除 | `UploaderBeforeDelete`         | -                  |

**`UploadFile`**

| 参数               | 说明                                                         | 类型                                | 默认值 |
| :----------------- | :----------------------------------------------------------- | :---------------------------------- | :----- |
| `url`              | 文件地址                                                     | `string`                            | -      |
| `tempUrl`          | 临时文件地址，`base64` 或者 `string`                         | `string`                            | -      |
| `key`              | 文件唯一标识符，未指定则默认生成                             | `React.Key`                         | -      |
| `status`           | 上传状态                                                     | `'done' |'uploading' |'failed' |''` | -      |
| `name`             | 文件名，非图片类型文件时显示                                 | `string`                            | -      |
| `message`          | 上传失败 \| 上传中时展示                                     | `string`                            | -      |
| `percent`          | 上传进度，非 0 时展示进度条，范围 [0, 100]                   | `number`                            | -      |
| `file`             | 文件对象                                                     | `File`                              | -      |
| `showDeleteButton` | 上传状态是否显示删除按钮（当上传请求可以取消时，建议设置为true） | `boolean`                           | -      |
| `response`         | 上传完成后，服务端响应内容                                   | `any`                               | -      |

**`RequestOptions`**

| 参数            | 说明                     | 类型                                                         | 默认值   |
| :-------------- | :----------------------- | :----------------------------------------------------------- | :------- |
| `url`           | 必传；上传服务器地址     | `string`                                                     | -        |
| `method`        | 上传请求的 `http method` | `'GET' |'POST' |'PUT' |'DELETE' |'PATCH' |'HEAD' |'OPTIONS'` | `'POST'` |
| `headers`       | 设置上传的请求头部       | `Record<string, string>`                                     | `{}`     |
| `timeout`       | 请求过期时间             | `number`                                                     | `0`      |
| `responseType`  | 响应数据类型             | `XMLHttpRequestResponseType`                                 | ` text`  |
| `data`          | ` file` 之外的请求参数   | `{[key: string]: string |Blob}`                              | -        |
| `maxConcurrent` | 最大并发上传个数         | `number`                                                     | `5`      |

```typescript
type UploaderBeforeRead = (files: File[]) => boolean | Promise<boolean | File[]>;
type UploaderAfterRead = (newFiles: UploadFile[], fileList: UploadFile[]) => void;
type UploaderBeforeDelete = (file: UploadFile, index: number) => boolean | Promise<boolean> | void;
```

