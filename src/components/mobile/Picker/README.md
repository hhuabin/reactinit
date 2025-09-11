# 使用说明

```tsx
// 直接引入使用
<Picker></Picker>
```



## 参数

| 参数               | 说明                   | 类型                                         | 默认值      |
| ------------------ | ---------------------- | -------------------------------------------- | ----------- |
| `visible`          | 是否显示               | `boolean`                                    | `true`      |
| `columns`          | 配置列的选项           | `PickerColumn[]`                             | `[]`        |
| `defaultIndex`     | 默认选中项             | `number[]`                                   | `[]`        |
| `title`            | 标题                   | `string`                                     | `''`        |
| `cancelText`       | 取消按钮的文字         | `string`                                     | `'取消'`    |
| `confirmText`      | 确定按钮的文字         | `string`                                     | `'确定'`    |
| `primaryColor`     | 主题色                 | `string`                                     | `'#1989fa'` |
| `visibleOptionNum` | 可见的选项个数         | `number`                                     | `6`         |
| `onChangeVisible`  | 显示状态改变时触发函数 | `(value: boolean) => void`                   | -           |
| `onConfirm`        | 确认时触发函数         | `(params: PickerConfirmEventParams) => void` | -           |
| `onCancel`         | 取消时触发函数         | `() => void`                                 | -           |

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
const pickerColumns3: PickerColumn = [
    {
        label: '广东',
        value: 'guangdong',
        children: [
            {
                label: '广州',
                value: 'guangzhou',
                children: [
                    { label: '越秀', value: 'yuexiu' },
                    { label: '海珠', value: 'haizhu' },
                    { label: '荔湾', value: 'liwan' },
                    { label: '天河', value: 'tianhe' },
                    { label: '番禺', value: 'panyu' },
                    { label: '花都', value: 'huadu' },
                    { label: '南沙', value: 'nansha' },
                    { label: '增城', value: 'zengcheng' },
                    { label: '从化', value: 'conghua' },
                ],
            },
            {
                label: '深圳',
                value: 'shenzhen',
                children: [
                    { label: '福田', value: 'futian' },
                    { label: '南山', value: 'nanshan' },
                    { label: '罗湖', value: 'luohu' },
                    { label: '宝安', value: 'baoan' },
                    { label: '龙岗', value: 'longgang' },
                    { label: '龙华', value: 'longhua' },
                ],
            },
            {
                label: '茂名',
                value: 'maoming',
                children: [
                    { label: '茂南', value: 'maonan' },
                    { label: '电白', value: 'dianbai' },
                    { label: '茂港', value: 'maogang' },
                    { label: '高州', value: 'gaozhou' },
                    { label: '化州', value: 'huazhou' },
                    { label: '信宜', value: 'xinyi' },
                ],
            },
            {
                label: '惠州',
                value: 'huizhou',
                children: [
                    { label: '惠城', value: 'huicheng' },
                    { label: '惠阳', value: 'huiyang' },
                    { label: '博罗', value: 'boluo' },
                    { label: '惠东', value: 'huidong' },
                    { label: '龙门', value: 'longmen' },
                ],
            },
        ],
    },
    {
        label: '北京',
        value: 'beijing',
        children: [
            { label: '东城', value: 'dongcheng' },
            { label: '西城', value: 'xicheng' },
            { label: '朝阳', value: 'chaoyang' },
            { label: '丰台', value: 'fengtai' },
            { label: '石景山', value: 'shijingshan' },
            { label: '海淀', value: 'haidian' },
        ],
    },
    {
        label: '上海',
        value: 'shanghai',
        children: [
            { label: '黄浦', value: 'huangpu' },
            { label: '徐汇', value: 'xuhui' },
            { label: '长宁', value: 'changning' },
            { label: '静安', value: 'jingan' },
            { label: '普陀', value: 'putuo' },
            { label: '闸北', value: 'zhabei' },
        ],
    },
    {
        label: '浙江',
        value: 'zhejiang',
        children: [
            {
                label: '杭州',
                value: 'hangzhou',
                children: [
                    { label: '上城', value: 'shangcheng' },
                    { label: '下城', value: 'xiacheng' },
                    { label: '拱墅', value: 'gongshu' },
                    { label: '西湖', value: 'xihu' },
                    { label: '滨江', value: 'binjiang' },
                    { label: '萧山', value: 'xiaoshan' },
                ],
            },
            {
                label: '宁波',
                value: 'ningbo',
                children: [
                    { label: '海曙', value: 'haishu' },
                    { label: '江北', value: 'jiangbei' },
                    { label: '北仑', value: 'beilun' },
                    { label: '镇海', value: 'zhenhai' },
                    { label: '鄞州', value: 'yinzhou' },
                ],
            },
            {
                label: '温州',
                value: 'wenzhou',
                children: [
                    { label: '鹿城', value: 'lucheng' },
                    { label: '龙湾', value: 'longwan' },
                    { label: '瓯海', value: 'ouhai' },
                    { label: '洞头', value: 'dongtou' },
                    { label: '永嘉', value: 'yongjia' },
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
    onConfirm={handleConfirmPicker}
    onCancel={() => setPickerVisible(false)}
></Picker>
```

