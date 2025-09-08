// 配置列的选项
export type PickerColumn = (
    string | { label: string | number; value: string | number }
)[]

// onConfirm事件参数
export type PickerConfirmEventParams = {
    selectIndex: number,
    selectOption: PickerColumn[number],
    selectValue: string | number
}
