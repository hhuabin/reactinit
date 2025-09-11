# 使用说明

```tsx
// 直接引入使用
<SinglePicker></SinglePicker>
```



## 参数

| 参数               | 说明                   | 类型                                         | 默认值      |
| ------------------ | ---------------------- | -------------------------------------------- | ----------- |
| `visible`          | 是否显示               | `boolean`                                    | `true`      |
| `columns`          | 配置列的选项           | `PickerColumn`                               | `[]`        |
| `defaultIndex`     | 默认选中项             | `number`                                     | `0`         |
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
interface PickerOption {
    label: string | number;
    value: string | number;
}

type PickerColumn = (string | number | PickerOption)[]
```

`PickerConfirmEventParams`

```typescript
type PickerConfirmEventParams<T extends string | number | PickerOption = PickerOption> = {
    selectIndex: number;
    selectOption: T extends number ? number : T extends string ? string : PickerOption;
    selectValue: T extends number ? number : T extends string ? string : string | number;
}
```

