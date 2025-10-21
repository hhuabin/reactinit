# 功能说明

1. 支持左右滑动、上下滑动
2. 支持自动播放，自定义自动播放间隔时长
3. 支持循环播放
4. 支持自定义宽高
5. 支持自定义指示器

## 组件优点

在`<Swiper></Swiper>`中没有采用前后增加一个轮播项的办法实现循环播放，而是通过改变轮播首项和轮播尾项`translate3d`值实现首尾衔接，如3个`SwiperItem`永远也只有3个`SwiperItem`而不会是5个`SwiperItem`。方便开发调试。

实现了组件库`vant`的`Swipe`组件的所有功能，但是继承了`Swipe`的bug

## bug说明

```tsx
<Swiper loop={true} basicOffset={30} slideItemSize={300}></Swiper>
```

- 以上使用方式尚有首尾项连接不顺的问题
- 问题根源：在`updateAnimate`函数中，当动画执行结束才会触发`updateAnimateByIndex(0)`或`updateAnimateByIndex(swiperItemCount - 1)`函数。动画执行过程中，如`n + 1`轮播项的右侧明显是空的
- 这个问题组件库`vant`也存在，但`antd-mobile`并不存在这个问题。但我采用了与`vant`一样原理编写代码，便于理解。
- 修复bug思路：参考`antd-mobile`。在移动的同时修改所有`SwiperItem`的`translate3d`，而不是全部依赖于滑动轨道。此改动较大，建议重写



# 使用说明

```tsx
// 引入方式 1
import Swiper, { SwiperItem } from '@/components/mobile/Swiper'
// 引入方式 2
import Swiper from '@/components/mobile/Swiper'
const { SwiperItem } = Swiper

const SwiperComponent: React.FC = () => {
    return (
        <Swiper>
            <SwiperItem>
                <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
            </SwiperItem>
            <SwiperItem>
                <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
            </SwiperItem>
        </Swiper>
    )
}
```



## 参数

| 参数               | 说明                                      | 类型                                                         | 默认值         |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------ | -------------- |
| `direction`        | 滚动方向                                  | `'horizontal' | 'vertical'`                                  | `'horizontal'` |
| `autoplay`         | 是否自动切换                              | `boolean`                                                    | `false`        |
| `duration`         | 切换动画时长，单位为 ms                   | `number`                                                     | `500`          |
| `loop`             | 是否循环播放                              | `boolean`                                                    | `false`        |
| `autoplayInterval` | 自动切换的间隔，单位为 ms                 | `number`                                                     | `3000`         |
| `defaultIndex`     | 默认位置索引值                            | `number`                                                     | `0`            |
| `width`            | 滑块宽度，若是 number 类型，则单位是 px   | `number | string`                                            | `'100%'`       |
| `height`           | 滑块高度，若是 number 类型，则单位是 px   | `number | string`                                            | `'100%'`       |
| `basicOffset`      | 滑块基础偏移量，单位 px                   | `number`                                                     | `0`            |
| `slideItemSize`    | 轮播项的宽 / 高，单位 px                  | `number`                                                     | 滑块的宽 / 高  |
| `showIndicator`    | 是否显示指示器                            | `boolean`                                                    | `true`         |
| `indicatorColor`   | 指示器颜色                                | `string`                                                     |                |
| `indicator`        | 自定义指示器，优先级比 `showIndicator` 高 | `(total: number, current: number) => React.ReactNode`        | -              |
| `touchable`        | 是否可以通过手势滑动                      | `boolean`                                                    | `true`         |
| `stopPropagation`  | 是否阻止滑动事件冒泡                      | `boolean`                                                    | `true`         |
| `style`            | 自定义样式                                | `React.CSSProperties`                                        | `{}`           |
| `onChange`         | 切换时触发                                | `(index: number) => void`                                    | -              |
| `children`         | 轮播内容(`<SwiperItem/>`)                 | `React.ReactElement<typeof SwiperItem> | React.ReactElement<typeof SwiperItem>[]` | -              |



## 自动播放

```tsx
<Swiper autoplay={true}>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```



## 循环播放

```tsx
<Swiper loop={true}>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```



## 纵向滚动

```tsx
<Swiper direction='vertical' loop={true}>
    <SwiperItem key={111}>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```



## 自定义轮播项宽度

当循环播放时，尚有首尾轮播项项连接不顺畅bug。故该情况不建议使用`loop = true`

```tsx
<Swiper loop={true} slideItemSize={300}>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```

## 循环居中播放

当循环播放时，尚有首尾轮播项项连接不顺畅bug。故该情况不建议使用`loop = true`

```tsx
// 当 Swiper 宽 360 时，30 + 300 + 30 = 360
<Swiper loop={true} basicOffset={30} slideItemSize={300}>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```



## 无指示器

```tsx
<Swiper loop={true} indicator={() => (<></>)}>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#ace0ff]'>1</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#bcffbd]'>2</div>
    </SwiperItem>
    <SwiperItem>
        <div className='flex justify-center items-center w-full h-full text-[24px] bg-[#1989fa]'>3</div>
    </SwiperItem>
</Swiper>
```

