/**
 * @Author: bin
 * @Date: 2025-12-30 16:12:27
 * @LastEditors: bin
 * @LastEditTime: 2026-01-21 09:42:01
 */
import './Skeleton.less'

type SkeletonProps = {
    loading?: boolean;                         // 是否显示骨架屏
    children?: React.ReactNode | (() => React.ReactNode);             // Skeleton 子元素
    renderSkeleton?: React.ReactNode | (() => React.ReactNode);       // 自定义 Skeleton
    className?: string;                        // 自定义类名
    style?: React.CSSProperties;               // 自定义样式
}

/**
 * @description 骨架屏
 * 临时用一下 Loading 先，以后有空再写
 */

const Skeleton: React.FC<SkeletonProps> = (props) => {

    const {
        loading = true,
        children = null,
        renderSkeleton,
        className = '',
        style = {},
    } = props

    if (!loading) {
        // 加载完成，显示目标元素
        if (typeof children === 'function') {
            return children()
        } else {
            return children
        }
    } else {
        // 加载中，显示 Skeleton
        if (typeof renderSkeleton === 'function') {
            return renderSkeleton()
        } else {
            return renderSkeleton ?? (
                <div
                    className={'bin-skeleton' + (className ? ' ' + className : '')}
                    style={style}
                >
                    <svg width='50px' height='50px' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                        <circle cx='25' cy='50' r='6' fill='#66b8ff'>
                            <animate attributeName='cx' values='25;50;25' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#66b8ff;#66b8ff;#66b8ff' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                        <circle cx='50' cy='50' r='6' fill='#66b8ff'>
                            <animate attributeName='r' values='6;9;6' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#66b8ff;#66b8ff;#66b8ff' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                        <circle cx='75' cy='50' r='6' fill='#66b8ff'>
                            <animate attributeName='cx' values='75;50;75' dur='1s' repeatCount='indefinite' begin='0s' />
                            <animate attributeName='fill' values='#66b8ff;#66b8ff;#66b8ff' dur='1s' repeatCount='indefinite' begin='0s' />
                        </circle>
                    </svg>
                </div>
            )
        }
    }
}

export default Skeleton
