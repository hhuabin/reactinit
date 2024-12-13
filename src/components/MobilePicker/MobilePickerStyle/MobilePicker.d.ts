// 配置列的选项
type PickerColumn = (
    string | { label: string | number; value: string | number }
)[]

// onConfirm事件参数
type PickerConfirmEventParams = {
    selectIndex: number,
    selectOption: PickerColumn[number],
    selectValue: string | number
}

interface PickerProps {
    visible?: boolean;                  // 是否显示
    columns?: PickerColumn;             // 配置列的选项
    defaultIndex?: number;              // 默认选中项
    title?: string;                     // 标题
    cancelText?: string;                // 取消按钮的文字
    confirmText?: string;               // 确定按钮的文字
    primaryColor?: string;              // 主题色
    visibleOptionNum?: number;          // 可见的选项个数
    onConfirm?: (params: PickerConfirmEventParams) => void;       // 确认时触发函数
    onCancel?: () => void;             // 取消时触发函数
}

export type {
    PickerColumn,
    PickerConfirmEventParams,
    PickerProps,
}
