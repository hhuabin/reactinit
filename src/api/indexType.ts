// 公共请求参数
export interface PublicParam {
    readonly userId?: string;
    readonly loading?: boolean;
    readonly cancelLastFetch?: boolean;
    readonly cancelLastRequest?: boolean;
}
// 公共返回参数
export interface IpublicAnswer {
    readonly result_code: string;
    readonly err_msg: string;
}
