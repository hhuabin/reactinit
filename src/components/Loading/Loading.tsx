/**
 * @Author: bin
 * @Date: 2024-05-29 22:12:59
 * @LastEditors: bin
 * @LastEditTime: 2026-01-21 09:35:07
 */
type LoadingProps = {
    beginColor?: string;
    endColor?: string;
    size?: string;
    duration?: number;
}

/**
 * #66b8ff - #1890ff
 * #f4f4f4 - #d8d8d8
 */

const Loading: React.FC<LoadingProps> = (props) => {

    const {
        beginColor = '#66b8ff',
        endColor = '#1890ff',
        size = '50px',
        duration = 1,
    } = props

    return (
        <div className='flex justify-center items-center w-full h-full'>
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

export default Loading
