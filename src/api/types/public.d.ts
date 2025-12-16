/**
 * @Author: bin
 * @Date: 2024-12-16 09:17:45
 * @LastEditors: bin
 * @LastEditTime: 2025-12-10 14:08:06
 */
// 公共请求参数
export interface PublicParam {
    readonly userId?: string;
    readonly showLoading?: boolean;             // 是否显示 loading
    readonly maxRequestRetryNumber?: number;    // 请求失败重试次数
    readonly cancelLastRequest?: boolean;       // 是否取消上一个携带 cancelLastRequest 的请求
}
// 公共返回参数
export interface PublicAnswer {
    readonly result_code: string;
    readonly err_msg: string;
}
