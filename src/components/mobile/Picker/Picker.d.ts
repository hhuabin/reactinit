/* eslint-disable @typescript-eslint/no-explicit-any */

// 配置列的选项
export type Numeric = number | string;

export interface PickerOption {
    label?: Numeric;
    value?: Numeric;
    children?: PickerColumn;
    [key: PropertyKey]: any;
}
export type PickerColumn = PickerOption[]

// onConfirm事件参数
export type PickerConfirmEventParams = {
    selectedIndexs: number[];
    selectedOptions: PickerOption[];
    selectedValues: Numeric[];
}
