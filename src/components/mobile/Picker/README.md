# 功能说明

### 单列选择器 / 多列选择器 / 级联选择器

1. 点击、滑动、惯性滑动等基础功能
2. 受控 / 非受控
3. `loading`功能
4. 只有点击确定才会更改选中项目，不确定均是临时选中项
5. `columns`切换，选中项默认重置到`defaultIndexs`



### 级联选择器独有功能

1. 滑动父级，子级选中项全部默认重置为 `0`



# 使用说明

```tsx
// 直接引入使用
<Picker></Picker>
```



## 参数

| 参数                | 说明                             | 类型                                         | 默认值                               |
| ------------------- | -------------------------------- | -------------------------------------------- | ------------------------------------ |
| `visible`           | 是否显示                         | `boolean`                                    | `true`                               |
| `columns`           | 配置列的选项                     | `PickerColumn[]`                             | `[]`                                 |
| `defaultIndexs`     | 默认选中项                       | `number[]`                                   | `[]`                                 |
| `columnsFieldNames` | 自定义列字段名称                 | `{ label?: string, value?: string }`         | `{ label: 'label', value: 'value' }` |
| `loading`           | 是否显示加载中                   | `boolean`                                    | `false`                              |
| `title`             | 标题                             | `string`                                     | `''`                                 |
| `cancelText`        | 取消按钮的文字                   | `string`                                     | `'取消'`                             |
| `confirmText`       | 确定按钮的文字                   | `string`                                     | `'确定'`                             |
| `primaryColor`      | 主题色                           | `string`                                     | `'#1989fa'`                          |
| `visibleOptionNum`  | 可见的选项个数                   | `number`                                     | `6`                                  |
| `closeOnPopstate`   | 是否在 `popstate` 时关闭图片预览 | `boolean`                                    | `true`                               |
| `className`         | 自定义类名                       | `string`                                     | `''`                                 |
| `style`             | 自定义样式                       | `React.CSSProperties`                        | `{}`                                 |
| `getContainer`      | 指定挂载的节点                   | `HTMLElement | (() => HTMLElement) | null`   | `document.body`                      |
| `onChangeVisible`   | 显示状态改变时触发函数           | `(value: boolean) => void`                   | -                                    |
| `onConfirm`         | 确认时触发函数                   | `(params: PickerConfirmEventParams) => void` | -                                    |
| `onCancel`          | 取消时触发函数                   | `() => void`                                 | -                                    |

`PickerColumn`

```typescript
type Numeric = number | string;

interface PickerOption {
    label?: Numeric;
    value?: Numeric;
    children?: PickerColumn;
    [key: PropertyKey]: any;
}
type PickerColumn = PickerOption[]
```

`PickerConfirmEventParams`

```typescript
type PickerConfirmEventParams = {
    selectedIndexs: number[],
    selectedOptions: PickerOption[],
    selectedValues: Numeric[]
}
```



##　单列选择

```tsx
const pickerColumns1: PickerColumn = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
]

const [pickerValue, setPickerValue] = useState('')
const [pickerVisible, setPickerVisible] = useState(false)
const [pickerColumns, setPickerColumns] = useState(pickerColumns1)

const handleConfirmPicker = ({ selectedIndexs, selectedOptions, selectedValues }: PickerConfirmEventParams) => {
    console.log('selectedOptions', selectedIndexs, selectedOptions, selectedValues)
    const selectedValue = selectedValues.join(', ')
    setPickerValue(selectedValue)
}

<Picker
    visible={pickerVisible}
    onChangeVisible={(value) => setPickerVisible(value)}
    defaultIndex={[2]}
    columns={pickerColumns}
    onConfirm={handleConfirmPicker}
    onCancel={() => setPickerVisible(false)}
></Picker>
```



## 多列选择

```tsx
const pickerColumns2: PickerColumn[] = [
    // 第一列
    [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
    ],
    // 第二列
    [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
    ],
]

<Picker
    visible={pickerVisible}
    onChangeVisible={(value) => setPickerVisible(value)}
    defaultIndex={[1, 2]}
    columns={pickerColumns2}
    onConfirm={handleConfirmPicker}
    onCancel={() => setPickerVisible(false)}
></Picker>
```



## 级联选择

```tsx
const pickerColumns31: PickerColumn = [
    {
        cityName: '广东',
        value: 'guangdong',
        children: [
            {
                cityName: '广州',
                value: 'guangzhou',
                children: [
                    { cityName: '越秀', value: 'yuexiu' },
                    { cityName: '海珠', value: 'haizhu' },
                    { cityName: '荔湾', value: 'liwan' },
                    { cityName: '天河', value: 'tianhe' },
                    { cityName: '番禺', value: 'panyu' },
                    { cityName: '花都', value: 'huadu' },
                    { cityName: '南沙', value: 'nansha' },
                    { cityName: '增城', value: 'zengcheng' },
                    { cityName: '从化', value: 'conghua' },
                ],
            },
            {
                cityName: '深圳',
                value: 'shenzhen',
                children: [
                    { cityName: '福田', value: 'futian' },
                    { cityName: '南山', value: 'nanshan' },
                    { cityName: '罗湖', value: 'luohu' },
                    { cityName: '宝安', value: 'baoan' },
                    { cityName: '龙岗', value: 'longgang' },
                    { cityName: '龙华', value: 'longhua' },
                ],
            },
            {
                cityName: '茂名',
                value: 'maoming',
                children: [
                    { cityName: '茂南', value: 'maonan' },
                    { cityName: '电白', value: 'dianbai' },
                    { cityName: '茂港', value: 'maogang' },
                    { cityName: '高州', value: 'gaozhou' },
                    { cityName: '化州', value: 'huazhou' },
                    { cityName: '信宜', value: 'xinyi' },
                ],
            },
            {
                cityName: '惠州',
                value: 'huizhou',
                children: [
                    { cityName: '惠城', value: 'huicheng' },
                    { cityName: '惠阳', value: 'huiyang' },
                    { cityName: '博罗', value: 'boluo' },
                    { cityName: '惠东', value: 'huidong' },
                    { cityName: '龙门', value: 'longmen' },
                ],
            },
        ],
    },
    {
        cityName: '北京',
        value: 'beijing',
        children: [
            { cityName: '东城', value: 'dongcheng' },
            { cityName: '西城', value: 'xicheng' },
            { cityName: '朝阳', value: 'chaoyang' },
            { cityName: '丰台', value: 'fengtai' },
            { cityName: '石景山', value: 'shijingshan' },
            { cityName: '海淀', value: 'haidian' },
        ],
    },
    {
        cityName: '上海',
        value: 'shanghai',
        children: [
            { cityName: '黄浦', value: 'huangpu' },
            { cityName: '徐汇', value: 'xuhui' },
            { cityName: '长宁', value: 'changning' },
            { cityName: '静安', value: 'jingan' },
            { cityName: '普陀', value: 'putuo' },
            { cityName: '闸北', value: 'zhabei' },
        ],
    },
    {
        cityName: '浙江',
        value: 'zhejiang',
        children: [
            {
                cityName: '杭州',
                value: 'hangzhou',
                children: [
                    { cityName: '上城', value: 'shangcheng' },
                    { cityName: '下城', value: 'xiacheng' },
                    { cityName: '拱墅', value: 'gongshu' },
                    { cityName: '西湖', value: 'xihu' },
                    { cityName: '滨江', value: 'binjiang' },
                    { cityName: '萧山', value: 'xiaoshan' },
                ],
            },
            {
                cityName: '宁波',
                value: 'ningbo',
                children: [
                    { cityName: '海曙', value: 'haishu' },
                    { cityName: '江北', value: 'jiangbei' },
                    { cityName: '北仑', value: 'beilun' },
                    { cityName: '镇海', value: 'zhenhai' },
                    { cityName: '鄞州', value: 'yinzhou' },
                ],
            },
            {
                cityName: '温州',
                value: 'wenzhou',
                children: [
                    { cityName: '鹿城', value: 'lucheng' },
                    { cityName: '龙湾', value: 'longwan' },
                    { cityName: '瓯海', value: 'ouhai' },
                    { cityName: '洞头', value: 'dongtou' },
                    { cityName: '永嘉', value: 'yongjia' },
                ],
            },
        ],
    },
]

<Picker
    visible={pickerVisible}
    onChangeVisible={(value) => setPickerVisible(value)}
    defaultIndex={[1, 2, 3]}
    columns={pickerColumns3}
    columnsFieldNames={{ label: 'cityName' }}
    onConfirm={handleConfirmPicker}
    onCancel={() => setPickerVisible(false)}
></Picker>
```



# 返回关闭弹窗而不退出当前路由

该设计尚处于实验阶段

```typescript
    /**
     * @description Picker 返回行为处理：
     * 1. 预览打开时通过 pushState 注入一条 history
     * 2. 监听 popstate，在浏览器返回时关闭 Picker
     */
    useEffect(() => {
        // 打开 Picker 时压入一条 history，用于拦截浏览器返回并关闭预览
        if (closeOnPopstate && mergeVisible && history.state?.ui !== 'picker') {
            window.history.pushState({ ui: 'picker' }, '', location.href)
        } else if (!mergeVisible && history.state?.ui === 'picker') {
            window.history.back()
        }
        // 手动关闭 mergeVisible 没有回退路由
    }, [closeOnPopstate, mergeVisible])

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (closeOnPopstate && event.state?.ui === 'picker') {
                setMergeVisible(false)
            }
        }

        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [closeOnPopstate, setMergeVisible])
```

