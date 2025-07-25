# 原理

直接原理：使用 `React.createPortal` 将 `Message` 组件渲染到 自定义元素 或者 `document.body`中

总共分为三层结构：

1. 第一层：代理层`Message.tsx`；

   `open / typeOpen`：代理 `message` 的所有方法，每次任务触发的方法都会收入到 `taskQueue` 中

   `flushNotice`：消费 `taskQueue`，将其转发到 `MessageInstance` 实例中

2. 第二层：实例/列表层`useMessage.tsx` ；

   `useInternalMessage`：受理 `Message` 转发过来的方法，将非 `open` 的打开方法转发给 `open` 方法

   `Notifications`：维护**消息列表`messageConfigList`**，`useInternalMessage` 受理的所有方法最终都会转发到此组件，最终改变消息列表`messageConfigList`

3. 第三层：监控/渲染层`NoticeList.tsx`；

   `NoticeList`：维护**渲染列表`noticeList`**，监控`messageConfigList`

   若`messageConfigList`发生变化，触发消息列表`messageConfigList`和渲染列表`noticeList`的对比

   1. `messageConfigList`新增的消息直接添加到`noticeList`中

   2. `messageConfigList`删除的消息，`noticeList`将会执行该元素的关闭动画逻辑，动画执行完毕再删除`noticeList`中的该元素，即渲染逻辑分开执行

      （若一个消息被关闭，`messageConfigList`将直接删除该消息，保证消息列表的准确性，但是渲染列表`noticeList`将会给予时间供其执行关闭动画再删除）



# 使用

## API

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`

```typescript
message.info(
    'hello message',
    0,
    () => { console.log('关闭') },
)
```

| 参数     | 说明                                        | 类型                | 默认值 |
| :------- | :------------------------------------------ | :------------------ | :----- |
| content  | 提示内容                                    | ReactNode \| config | -      |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | number              | 3000   |
| onClose  | 关闭时触发的回调函数                        | function            | -      |

也可以对象的形式传递参数：

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.loading(config)`

```typescript
message.info({
    content: 'hello message'
    
    duration: 0,
    key: id.current,
    () => { console.log('关闭') },
})
```

`config` 对象属性如下：

| 参数     | 说明                                                         | 类型             | 默认值 |
| :------- | :----------------------------------------------------------- | :--------------- | :----- |
| content  | 提示内容                                                     | ReactNode        | -      |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭<br />（config的duration优先级更高） | number           | 3000   |
| icon     | 自定义图标                                                   | ReactNode        | -      |
| key      | 当前提示的唯一标志                                           | string \| number | -      |
| onClose  | 关闭时触发的回调函数                                         | function         | -      |



## 关闭方法

自动关闭：关闭后执行函数

```typescript
message.info({
    content: 'hello message'
    
    duration: 0,
    key: id.current,
    () => { console.log('关闭') },
})
.then(() => {
    console.log('关闭2')
})
// 关闭
// 关闭2
```

手动关闭：方法会返回一个关闭函数，执行该函数即可关闭消息

```typescript
const closeFn = message.loading({
    content: 'loading...'
    duration: 0,       // 以
    key: id.current,
    () => { console.log('关闭') },
}, 3000)

closeFn()     // 手动关闭函数
```



## 全局方法

还提供了全局配置和全局销毁方法：

- `message.config(options)`
- `message.destroy()`

```typescript
message.config({
    duration: 3000,
    getContainer: () => messageRef.current,
})
```

| 参数         | 说明                                     | 类型              | 默认值              |
| :----------- | :--------------------------------------- | :---------------- | :------------------ |
| duration     | 默认自动关闭延时，单位秒                 | number            | 3000                |
| getContainer | 配置渲染节点的输出位置，但依旧为全屏展示 | () => HTMLElement | () => document.body |



## 实例化

```typescript
const Message = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const open = () => {
        messageApi.info({
            content: 'hello message'
        })
    }

    const destory = () => {
        messageApi.destory()
    }

    return (
        <>
            {contextHolder}
            <div></div>
        </>
    )
}
```

