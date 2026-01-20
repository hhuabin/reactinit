# 优点（与 `<img />` 相比）

1. 默认开启懒加载
2. 增加 `loading` 状态（支持渐进加载）
3. 增加 `error` 状态
4. 监听 `onLoad`、`onError`、`onLoadEnd` 事件



# 使用说明

```tsx
import Image from '@/components/mobile/Image'

const ImageComponent: React.FC = () => {
    return (
        <Image></Image>
    )
}
```



## 参数

| 参数          | 说明                                                       | 类型                                                      | 默认值    |
| ------------- | ---------------------------------------------------------- | --------------------------------------------------------- | --------- |
| `src`         | 图片地址                                                   | `string`                                                  | `''`      |
| `alt`         | 替代文本                                                   | `string`                                                  | `''`      |
| `width`       | 图片宽度，默认值 `auto`，若是 `number` 类型，则单位是 `px` | `number | string`                                         | `auto`    |
| `height`      | 图片高度，默认值 `auto`，若是 `number` 类型，则单位是 `px` | `number |string`                                          | `auto`    |
| `fit`         | 图片填充模式                                               | `'contain' | 'cover' | 'fill'`                            | `contain` |
| `showLoading` | 是否显示加载中                                             | `boolean`                                                 | `true`    |
| `showError`   | 是否显示加载失败                                           | `boolean`                                                 | `true`    |
| `lazyLoad`    | 是否懒加载，未启用                                         | `boolean`                                                 | `true`    |
| `className`   | 自定义类名                                                 | `string`                                                  | `''`      |
| `style`       | 自定义样式                                                 | `React.CSSProperties`                                     | `{}`      |
| `loadingIcon` | 加载时提示的占位元素，渐进式加载可用                       | `React.ReactNode | ((src: string) => React.ReactNode)`    | -         |
| `errorIcon`   | 加载失败时提示的占位元素                                   | `React.ReactNode |((src: string) => React.ReactNode)`     | -         |
| `onLoad`      | 图片加载完成事件                                           | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | -         |
| `onError`     | 图片加载失败事件                                           | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | -         |
| `onLoadEnd`   | 图片完成事件，不管失败还是成功都会执行                     | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | -         |



## CSS 变量

| 属性               | 说明             | 默认值 |
| ------------------ | ---------------- | ------ |
| `--bin-image-size` | 图片大小（宽高） | `auto` |



## 填充模式

```tsx
<Image
    src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    width={100}
    height={100}
    fit='contain'
></Image>
```



## 自定义图片加载中提示

```tsx
<Image
    src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`}
    width={100}
    height={100}
    loadingIcon={
        <Image
            src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200'
        ></Image>
    }
></Image>
```



## 自定义图片加载失败提示

```tsx
<Image
    width={100}
    height={100}
    src='http'
    errorIcon={
        <div className='w-full text-[#000] text-[16px] text-center'>加载失败</div>
    }
></Image>
```



## 监听加载成功事件

```tsx
<Image
    src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    width={150}
    height={150}
    onLoad={() => message.info('图片加载成功')}
></Image>
```

