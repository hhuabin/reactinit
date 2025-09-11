// 配置列的选项
export interface PickerOption {
    label: string | number;
    value: string | number;
}
export type PickerColumn = (string | number | PickerOption)[]

// onConfirm事件参数
export type PickerConfirmEventParams<T extends string | number | PickerOption = PickerOption> = {
    selectIndex: number;
    selectOption: T extends number ? number : T extends string ? string : PickerOption;
    selectValue: T extends number ? number : T extends string ? string : string | number;
}
