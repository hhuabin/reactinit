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
