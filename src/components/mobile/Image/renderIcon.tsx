export const defaultLoadingIcon = (
    <svg width='50px' height='50px' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='25' cy='50' r='6' fill='#f4f4f4'>
            <animate attributeName='cx' values='25;50;25' dur='1s' repeatCount='indefinite' begin='0s' />
            <animate attributeName='fill' values='#f4f4f4;#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
        </circle>
        <circle cx='50' cy='50' r='6' fill='#f4f4f4'>
            <animate attributeName='r' values='6;9;6' dur='1s' repeatCount='indefinite' begin='0s' />
            <animate attributeName='fill' values='#f4f4f4;#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
        </circle>
        <circle cx='75' cy='50' r='6' fill='#f4f4f4'>
            <animate attributeName='cx' values='75;50;75' dur='1s' repeatCount='indefinite' begin='0s' />
            <animate attributeName='fill' values='#f4f4f4;#d8d8d8;#f4f4f4' dur='1s' repeatCount='indefinite' begin='0s' />
        </circle>
    </svg>
)

export const defaultErrorIcon = (
    <svg width='36px' height='24px' viewBox='0 0 100 75' xmlns='http://www.w3.org/2000/svg'>
        <path d='M3 60L3 3L97 3L97 72L3 72L3 57L20 40L45 60L75 30L97 60' stroke='#ddd' strokeWidth='6'
            fill='none' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='25' cy='20' r='6' stroke='#ddd' strokeWidth='5' fill='none' strokeLinecap='round' />
    </svg>
)
