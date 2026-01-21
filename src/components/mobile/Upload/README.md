# 使用说明

```tsx
// 直接引入使用，不传任何参数亦可
<Upload></Upload>
```



## 参数

| 参数           | 说明                                                         | 类型                                                    | 默认值             |
| :------------- | :----------------------------------------------------------- | :------------------------------------------------------ | :----------------- |
| `fileList`     | 已上传的文件列表，需要和`onChange`配合使用                   | `UploadFile[]`                                          | `[]`               |
| `accept`       | 允许上传的文件类型，[详细说明](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file#限制允许的文件类型) | `string`                                                | `'image/*'`        |
| `maxCount`     | 文件上传数量限制，向前截断                                   | `number`                                                | `Number.MAX_VALUE` |
| `multiple`     | 是否支持多选文件                                             | `boolean`                                               | `false`            |
| `maxSize`      | 文件大小限制，单位为 `byte`                                  | `number`                                                | `Number.MAX_VALUE` |
| `preview`      | 是否允许图片预览                                             | `boolean`                                               | `true`             |
| `fit`          | 图片填充模式，详见 `Image`                                   | `'contain' | 'cover' | 'fill' | 'scale-down' |  'none'` | `'contain'`        |
| `drag`         | 是否开启拖拽上传                                             | `boolean`                                               | `true`             |
| `capture`      | 拍照方式（移动端生效，`environment` 调起后置摄像头且仅能拍照，`user` 调起前置摄像头且仅能拍照。）<br />`capture`在不同浏览器兼容不一样（`user`会直接拉起后置摄像头），不建议配置 | `boolean | 'environment' | 'user'`                      | -                  |
| `disabled`     | 是否禁用文件上传                                             | `boolean`                                               | `false`            |
| `action`       | 上传的请求配置                                               | `RequestOptions`                                        | `{}`               |
| `style`        | 自定义样式                                                   | `React.CSSProperties`                                   | `{}`               |
| `children`     | 自定义 `Upload children`                                     | `React.ReactNode`                                       | -                  |
| `isImageUrl`   | 用户自定义判断该文件是否为图片的方法                         | `(file: UploadFile) => boolean`                         | -                  |
| `onChange`     | 上传文件改变时的回调，上传每个阶段都会触发该事件，需要和`fileList`配合使用 | `(info: UploadFile[]) => void`                          | -                  |
| `beforeRead`   | **读取文件之前**的回调，返回`false | resolve(false) | reject()`，则停止读取；<br/>返回 `true | resolve(false)`则上传继续；<br/>切忌不可返回 `pedding` 状态的 `Promise` | `UploaderBeforeRead`                                    | -                  |
| `afterRead`    | **读取文件完成**后的回调；<br/>可用**函数式更新**将上传状态改成 `'uploading'` | `UploaderAfterRead`                                     | -                  |
| `beforeDelete` | 删除文件之前的回调，返回 `false | resolve(false) | reject()`，则停止删除 | `UploaderBeforeDelete`                                  | -                  |

**`UploadFile`**

| 参数        | 说明                                                         | 类型                                | 默认值 |
| :---------- | :----------------------------------------------------------- | :---------------------------------- | :----- |
| `url`       | 文件地址                                                     | `string`                            | -      |
| `tempUrl`   | 临时文件地址，`base64` 或者 `string`                         | `string`                            | -      |
| `key`       | 文件唯一标识符，未指定则默认生成                             | `React.Key`                         | -      |
| `status`    | 上传状态                                                     | `'done' |'uploading' |'failed' |''` | -      |
| `name`      | 文件名，非图片类型文件时显示                                 | `string`                            | -      |
| `message`   | 上传失败 \| 上传中时展示                                     | `string`                            | -      |
| `percent`   | 上传进度，非 0 时展示进度条，范围 `[0, 100]`                 | `number`                            | -      |
| `file`      | 文件对象                                                     | `File`                              | -      |
| `deletable` | 是否展示删除按钮，显示设置为 `false` 将不会展示<br />`status === 'uploading'`时默认不显示（开发者可显示设置成`true`）<br />其他状态默认显示 | `boolean`                           | `true` |
| `response`  | 上传完成后，服务端响应内容                                   | `any`                               | -      |

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



## Ref

| 属性         | 说明             | 类型         |
| ------------ | ---------------- | ------------ |
| `chooseFile` | 主动调起文件选择 | `() => void` |



## CSS 变量

| 属性                            | 说明               | 默认值    |
| ------------------------------- | ------------------ | --------- |
| `--bin-upload-size`             | 单个上传           | `80px`    |
| `--bin-upload-bg-color`         | 上传按钮背景颜色   | `#f7f8fa` |
| `--bin-upload-border-radius`    | 上传按钮圆角       | `6px`     |
| `--bin-upload-icon-color`       | 上传按钮`icon`颜色 | `#dcdee0` |
| `--bin-upload-delete-icon-size` | 删除按钮大小       | `14px`    |
| `--bin-upload-progress-color`   | 上传进度条背景颜色 | `#1677ff` |
