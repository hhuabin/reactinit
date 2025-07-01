import { useEffect } from 'react'

import ConfigProvider from '@/components/ConfigProvider/ConfigProvider'

const Test: React.FC = () => {

    return (
        <div>
            <ConfigProvider>
                <div>nihao</div>
            </ConfigProvider>
        </div>
    )
}

export default Test
