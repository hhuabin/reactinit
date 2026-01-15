# matrix

`matrix(a, b, c, d, e, f)` 是 **CSS 2D transform 的底层表示** 

```css
transform: matrix(a, b, c, d, e, f);
```

| 参数  | 含义                   | 常见用途       |
| ----- | ---------------------- | -------------- |
| **a** | x 方向缩放             | scaleX         |
| **b** | y 方向斜切（影响旋转） | skewY / rotate |
| **c** | x 方向斜切（影响旋转） | skewX / rotate |
| **d** | y 方向缩放             | scaleY         |
| **e** | x 方向平移             | translateX     |
| **f** | y 方向平移             | translateY     |

```css
/* 写法相等 */
transform: matrix(scale, 0, 0, scale, moveX, moveY);
transform: scale(scale) translate(moveX, moveY);

/* x，y 轴放大倍数为1，x轴平移为0，y轴平移为0，即什么都不干 */
transform: matrix(1, 0, 0, 1, 0, 0);
```



# 使用说明

```tsx
import ImagePreview, { showImagePreview } from '@/components/mobile/ImagePreview'

const ImagePreviewComponent: React.FC = () => {
    const [visible, setVisible] = useState(false)

    const show = () => {
        // 函数式调用
        showImagePreview({ images: demoImages })
    }

    return (
        <>
            {/* 组件调用 */}
            <ImagePreview
                visible={visible}
                images={demoImages}
                onClose={() => setVisible(false)}
            />
        </>
    )
}
```



## 参数

| 参数                  | 说明                                                   | 类型                                                  | 默认值         |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------- | -------------- |
| `visible`             | 是否显示                                               | `boolean`                                             | `false`        |
| `direction`           | 滚动方向                                               | `'horizontal' | 'vertical'`                           | `'horizontal'` |
| `loop`                | 是否循环播放                                           | `boolean`                                             | `false`        |
| `defaultIndex`        | 默认显示第几张图片                                     | `number`                                              | `0`            |
| `images`              | 图片地址列表                                           | `string[]`                                            | `[]`           |
| `maxZoom`             | 最大缩放倍数                                           | `number`                                              | `3`            |
| `minZoom`             | 最小缩放倍数                                           | `number`                                              | `1 / 3`        |
| `closeOnPopstate`     | 是否在 popstate 时关闭图片预览                         | `boolean`                                             | `true`         |
| `closeOnClickOverlay` | 是否在点击遮罩层后关闭图片预览                         | `boolean`                                             | `true`         |
| `doubleScale`         | 是否启用双击缩放手势，禁用后，点击时会立即关闭图片预览 | `boolean`                                             | `true`         |
| `stopPropagation`     | 是否阻止滑动事件冒泡                                   | `boolean`                                             | `true`         |
| `showIndicator`       | 是否显示指示器                                         | `boolean`                                             | `true`         |
| `indicator`           | 自定义指示器，优先级比 `showIndicator` 高              | `(total: number, current: number) => React.ReactNode` | -              |
| `showCloseBtn`        | 是否显示关闭按钮                                       | `boolean`                                             | `false`        |
| `renderFooter`        | 渲染额外内容                                           | `(index: number) => React.ReactNode`                  | -              |
| `className`           | 自定义类名                                             | `string`                                              | `''`           |
| `style`               | 自定义样式                                             | `React.CSSProperties`                                 | `{}`           |
| `getContainer`        | 指定挂载的节点                                         | `HTMLElement | (() => HTMLElement) | null`            | -              |
| `onClose`             | 关闭时触发                                             | `() => void`                                          | -              |
| `afterClose`          | 关闭动画结束后触发                                     | `() => void`                                          | -              |
| `onIndexChange`       | 切换时触发                                             | `(index: number) => void`                             | -              |
| `onLongPress`         | 长按当前图片时触发                                     | `(index: number) => void`                             | -              |



## `Ref`

| 属性         | 说明                 | 类型                      |
| ------------ | -------------------- | ------------------------- |
| `resetScale` | 重置当前图片的缩放比 | `() => void`              |
| `swipeTo`    | }切换到指定索引图片  | `(index: number) => void` |



## CSS 变量

| 属性                   | 说明             | 默认值 |
| ---------------------- | ---------------- | ------ |
| `--z-index`            | 蒙层层级         | `999`  |
| `--animation-duration` | 蒙层动画持续时间 | `0.3s` |



# 设计思路

## 1.图片展示

1. 我们将图片高宽比分成三类 **图片高宽比**、**机器（手机）高宽比**、**长图高宽比**(**2.6**，可修改)

   - 一类：**==图片高宽比== < 机器（手机）高宽比 < 长图高宽比**：**宽度**铺满，**高度**有富余空间。`width: 100%; height: auto;`

   - 二类：**机器（手机）高宽比 < ==图片高宽比== < 长图高宽比**：**高度**铺满，**宽度**有富余空间。`width: auto; height: 100%;` -> `isVerticalImage`

   - 三类：**机器（手机）高宽比 < 长图高宽比 < ==图片高宽比==**：**宽度**铺满，**高度**可滑动。`width: 100%; height: auto;`

     第三类情况下，由于图片默认展示中间部分，我们需要使用 `state.initializing` 参数，让图片从中间无缝切换到头部，这也是 `state.initializing` 的唯一用处

2. `CSS`类`.bin-image-preview-image`中定义图片展示默认是`width: 100%; height: auto;`图片将会撑满宽度并且高度居中展示；

   故而当图片是第二类时候，在该样式下宽度撑满，高度仍然又富余时，不符合我们的需求。我们就需要使用`isVerticalImage`判定图片是第二类，然后修改`CSS`样式，让图片高度铺满，但宽度不满`width: auto; height: 100%;`



## 2.单击关闭，双击方法

1. 在 `onTouchEnd` 启动定时器，定时器结束执行单击方法
2. 如果在 `TAP_TIME` (定时器还没结束之前)再次触发 `onTouchEnd` 事件，即为双击事件，执行双击方法