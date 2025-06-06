type Props = {
    readonly beginColor?: string;
    readonly endColor?: string;
    readonly size?: string;
    readonly duration?: number;
}

/**
 * #66b8ff - #1890ff
 * #f4f4f4 - #d8d8d8
 */

const Loading: React.FC<Props> = (props) => {

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

export default Loading
