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



# 设计思路

## 1.图片展示

1. 我们将图片高宽比分成三类 **图片高宽比**、**机器（手机）高宽比**、**长图高宽比**(**2.6**，可修改)

   - 一类：**==图片高宽比== < 机器（手机）高宽比 < 长图高宽比**：完整展示图片，**高宽**均有赋予空间。`width: 100%; height: auto;`

   - 二类：**机器（手机）高宽比 < ==图片高宽比== < 长图高宽比**：完整展示图片，**宽度**有赋予空间`width: auto; height: 100%;` -> `isVerticalImage`

   - 三类：**机器（手机）高宽比 < 长图高宽比 < ==图片高宽比==**：**宽度**铺满，**高度**可滑动`width: 100%; height: auto;`

     第三类情况下，由于图片默认展示中间部分，我们需要使用 `state.initializing` 参数，让图片从中间无缝切换到头部，这也是 `state.initializing` 的唯一用处

2. `CSS`类`.bin-image-preview-image`中定义图片展示默认是`width: 100%; height: auto;`图片将会撑满宽度并且高度居中展示；

   故而当图片是第二类时候，在该样式下宽度撑满，高度仍然又富余时，不符合我们的需求。我们就需要使用`isVerticalImage`判定图片是第二类，然后修改`CSS`样式，让图片高度铺满，但宽度不满`width: auto; height: 100%;`



## 2.单击关闭，双击方法