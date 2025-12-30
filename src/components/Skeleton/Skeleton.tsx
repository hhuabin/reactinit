/**
 * @Author: bin
 * @Date: 2025-12-30 16:12:27
 * @LastEditors: bin
 * @LastEditTime: 2025-12-30 16:21:04
 */
type SkeletonProps = {
    readonly beginColor?: string;
    readonly endColor?: string;
    readonly size?: string;
    readonly duration?: number;
}

/**
 * @description 骨架屏
 * 临时用一下 Loading 先，以后有空再写
 */

const Skeleton: React.FC<SkeletonProps> = (props) => {

    const {
        beginColor = '#66b8ff',
        endColor = '#1890ff',
        size = '50px',
        duration = 1,
    } = props

    return (
        <div className={'flex justify-center items-center w-full h-full'}>
            <svg width={size} height={size} viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                <circle cx='25' cy='50' r='6' fill={beginColor}>
                    <animate attributeName='cx' values='25;50;25' dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                    <animate attributeName='fill' values={`${beginColor};${endColor};${beginColor}`} dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                </circle>
                <circle cx='50' cy='50' r='6' fill={beginColor}>
                    <animate attributeName='r' values='6;9;6' dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                    <animate attributeName='fill' values={`${beginColor};${endColor};${beginColor}`} dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                </circle>
                <circle cx='75' cy='50' r='6' fill={beginColor}>
                    <animate attributeName='cx' values='75;50;75' dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                    <animate attributeName='fill' values={`${beginColor};${endColor};${beginColor}`} dur={`${duration}s`} repeatCount='indefinite' begin='0s' />
                </circle>
            </svg>
        </div>
    )
}

export default Skeleton
