/* eslint-disable max-lines */
import type { PickerColumn as SinglePickerColumn } from '@/components/mobile/Picker/SinglePicker'
import type {  PickerColumn } from '@/components/mobile/Picker'

export const singlePickerColumns1: SinglePickerColumn = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
export const singlePickerColumns2: SinglePickerColumn = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
]

export const pickerColumns11: PickerColumn = [
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
export const pickerColumns12: PickerColumn = [
    { label: '11', value: 11 },
    { label: '21', value: 21 },
    { label: '31', value: 31 },
    { label: '41', value: 41 },
    { label: '51', value: 51 },
    { label: '61', value: 61 },
    { label: '71', value: 71 },
    { label: '81', value: 81 },
    { label: '91', value: 91 },
    { label: '101', value: 101 },
]
export const pickerColumns21: PickerColumn[] = [
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
export const pickerColumns22: PickerColumn[] = [
    // 第一列
    [
        { label: '11', value: 11 },
        { label: '21', value: 21 },
        { label: '31', value: 31 },
        { label: '41', value: 41 },
        { label: '51', value: 51 },
        { label: '61', value: 61 },
        { label: '71', value: 71 },
        { label: '81', value: 81 },
        { label: '91', value: 91 },
        { label: '101', value: 101 },
    ],
    // 第二列
    [
        { label: '11', value: 11 },
        { label: '21', value: 21 },
        { label: '31', value: 31 },
        { label: '41', value: 41 },
        { label: '51', value: 51 },
        { label: '61', value: 61 },
        { label: '71', value: 71 },
        { label: '81', value: 81 },
        { label: '91', value: 91 },
        { label: '101', value: 101 },
    ],
]
export const pickerColumns31: PickerColumn = [
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
export const pickerColumns32: PickerColumn = [
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
]
