# 使用说明

```tsx
import Image from '@/components/mobile/Image'

const ImageComponent: React.FC = () => {
    return (
        <Image src={src}></Image>
    )
}
```



## 参数

| 参数          | 说明               | 类型                                                      | 默认值    |
| ------------- | ------------------ | --------------------------------------------------------- | --------- |
| `src`         | 图片地址           | `string`                                                  | -         |
| `alt`         | 替代文本           | `string`                                                  | `''`      |
| `fit`         | 图片填充模式       | `'contain' | 'cover' | 'fill'`                            | `contain` |
| `showLoading` | 是否显示加载中     | `boolean`                                                 | `true`    |
| `showError`   | 是否显示加载失败   | `boolean`                                                 | `true`    |
| `lazyLoad`    | 是否懒加载，未启用 | `boolean`                                                 | `true`    |
| `className`   | 自定义类名         | `string`                                                  | `''`      |
| `style`       | 自定义样式         | `React.CSSProperties`                                     | `{}`      |
| `onLoad`      | 图片加载完成事件   | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | -         |
| `onError`     | 图片加载失败事件   | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | -         |
|               |                    |                                                           |           |