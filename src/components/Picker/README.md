# 1.基础用法

```typescript
const columns = [
    { label: '周一', value: 'Monday' },
    { label: '周二', value: 'Tuesday' },
    { label: '周三', value: 'Wednesday' },
    { label: '周四', value: 'Thursday' },
    { label: '周五', value: 'Friday' },
]
```



# 2.多列选择

```typescript
const columns = [
    // 第一列
    [
        { label: '周一', value: 'Monday' },
        { label: '周二', value: 'Tuesday' },
        { label: '周三', value: 'Wednesday' },
        { label: '周四', value: 'Thursday' },
        { label: '周五', value: 'Friday' },
    ],
    // 第二列
    [
        { label: '上午', value: 'Morning' },
        { label: '下午', value: 'Afternoon' },
        { label: '晚上', value: 'Evening' },
    ],
]
```



# 3.级联选择

```typescript
const columns = [
    {
        label: '广东',
        value: 'Guangdong',
        children: [
            {
                label: '广州',
                value: 'Guangzhou',
                children: [
                    { label: '越秀区', value: 'Yuexiu' },
                    { label: '海珠区', value: 'Haizhu' },
                ],
            },
            {
                label: '深圳',
                value: 'Shenzhen',
                children: [
                    { label: '福田区', value: 'Futian' },
                    { label: '南山区', value: 'Nanshan' },
                ],
            },
        ],
    },
    {
        label: '浙江',
        value: 'Zhejiang',
        children: [
            {
                label: '杭州',
                value: 'Hangzhou',
                children: [
                    { label: '西湖区', value: 'Xihu' },
                    { label: '余杭区', value: 'Yuhang' },
                ],
            },
            {
                label: '温州',
                value: 'Wenzhou',
                children: [
                    { label: '鹿城区', value: 'Lucheng' },
                    { label: '瓯海区', value: 'Ouhai' },
                ],
            },
        ],
    },
]
```



# API

| Props            | 说明           | 类型                                | 默认值    |
| ---------------- | -------------- | ----------------------------------- | --------- |
| visible          | 是否显示选择器 | boolean                             | true      |
| columns          | 配置列的选项   | `PickerOption[] | PickerOption[][]` | []        |
| defaultIndex     | 默认选中项     | number                              | 0         |
| title            | 顶部栏标题     | string                              | ""        |
| confirmText      | 确认按钮文字   | string                              | "确定"    |
| cancelText       | 取消按钮文字   | string                              | "取消"    |
| primaryColor     | 主题色         | string                              | "#1989fa" |
| visibleOptionNum | 可见的选项个数 | number                              | 6         |



## 事件

```typescript
type PickerConfirmEventParams = {
    selectIndex: number,
    selectOption: PickerColumn,
    selectValue: string | number
}
```

| Events    | 说明               | 回调参数                                   |
| --------- | ------------------ | ------------------------------------------ |
| onConfirm | 点击完成按钮时触发 | (params: PickerConfirmEventParams) => void |
| onCancel  | 点击取消按钮时触发 | () => void                                 |



```typescript
/* Picker.d.ts */
/* eslint-disable @typescript-eslint/no-explicit-any */

// 配置列的选项
type Numeric = number | string;

type PickerOption = {
    label?: Numeric;
    value?: Numeric;
    children?: PickerColumn;
    [key: PropertyKey]: any;
}
type PickerColumn = PickerOption[]

// onConfirm事件参数
type PickerConfirmEventParams = {
    selectIndex: number,
    selectOption: Array<PickerOption | undefined>,
    selectValue: string | number
}

interface PickerProps {
    visible?: boolean;                 // 是否显示选择器
    columns?: PickerOption[] | PickerOption[][];            // 配置列的选项
    defaultIndex?: number;             // 默认选中项
    title?: string;                    // 顶部栏标题
    cancelText?: string;               // 取消按钮的文字
    confirmText?: string;              // 确定按钮的文字
    primaryColor?: string;             // 主题色
    visibleOptionNum?: number;         // 可见的选项个数
    onConfirm?: (params: PickerConfirmEventParams) => void;       // 确认时触发函数
    onCancel?: () => void;             // 取消时触发函数
}

export type {
    PickerOption,
    PickerColumn,
    PickerConfirmEventParams,
    PickerProps,
}

```

